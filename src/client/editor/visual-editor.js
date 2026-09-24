import { esc } from "../shared/html.js";
import { field, textarea, select } from "../shared/forms.js";
function createVisualEditor(context) {
  const { api, task, refresh, renderSite, notify } = context;
  const $ = (s) => document.querySelector(s);
  const sectionNames = { services: "Services", work: "Before & after", trust: "Trust & credentials", about: "Owner story", process: "Process", "roof-story": "Roof cutaway", area: "Project map", projects: "Project portfolio", gallery: "Photo gallery", contact: "Contact & estimate", request: "Inquiry form" };
  function startEditor(write) {
    const root = $("#visual-editor"), t = context.current.tenant;
    let draft = structuredClone(t.settings), timer, request = 0;
    const cinematic = draft.trade === "Roofing" && ["craft", "cinematic"].includes(draft.template);
    const defaults = cinematic ? ["services", "work", "trust", "about", "process", "roof-story", "materials", "area", "gallery", "contact", "request"] : ["services", "about", "process", "projects", "contact"];
    draft.sections = [...draft.sections || [], ...defaults.filter((id) => !draft.sections?.some((x) => x.id === id)).map((id) => ({ id, enabled: true }))];
    root.innerHTML = `<div class="editor-toolbar"><div><strong>Visual editor</strong><span id="editor-state" role="status">Saved draft</span></div><div class="device-tabs" role="group" aria-label="Preview width"><button type="button" data-device="1280px" aria-pressed="true">Desktop</button><button type="button" data-device="768px" aria-pressed="false">Tablet</button><button type="button" data-device="390px" aria-pressed="false">Mobile</button></div><button type="button" id="customize-toggle">Customize</button>${write ? '<button type="button" id="editor-reset">Discard edits</button><button type="button" id="editor-save" class="primary">Save draft</button>' : ""}</div><div class="editor-layout"><aside class="component-panel"><p class="eyebrow">PAGE ORDER</p><p class="pinned">Navigation + hero \xB7 locked</p><div id="section-list"></div><p class="pinned">Closing CTA + footer \xB7 locked</p></aside><div class="preview-canvas"><iframe title="Contractor website draft preview" id="editor-frame" src="/s/${esc(t.slug)}?preview=1" sandbox="allow-scripts allow-same-origin"></iframe></div><aside class="customize-panel" id="customize-panel"><h2>Customize</h2><form id="editor-fields">${field("Business name", "name", draft.name)}${select("Presentation", "template", ["craft", "cinematic", "clean", "editorial", "blueprint"], draft.template)}${field("Accent color", "color", draft.color, "color")}<label>Hero photograph<select name="heroPhotoId"><option value="">Template image / video</option>${context.current.photos.filter((p) => !p.project_id).map((p) => `<option value="${p.id}" ${draft.heroPhotoId === p.id ? "selected" : ""}>${esc(p.caption || "Uploaded image")}</option>`).join("")}</select></label>${field("Headline", "hero", draft.hero)}${textarea("Introduction", "intro", draft.intro)}${field("Primary CTA label", "ctaLabel", draft.ctaLabel || "Call for a free estimate")}${field("Phone", "phone", draft.phone, "tel")}${field("Email", "email", draft.email, "email")}${field("SEO title", "seoTitle", draft.seoTitle)}${textarea("Meta description", "seoDescription", draft.seoDescription, 2)}<label class="check"><input type="checkbox" name="claimsReviewed" ${draft.claimsReviewed ? "checked" : ""}> Business claims reviewed</label><label class="check"><input type="checkbox" name="showOwnerPhoto" ${draft.showOwnerPhoto !== false ? "checked" : ""}> Show owner photo</label><p>Upload photos and edit services in their dedicated tabs. Publishing remains a separate action.</p></form></aside></div>`;
    const status = root.querySelector("#editor-state"), frame = root.querySelector("iframe");
    let deviceWidth = 1280;
    const fitPreview = () => {
      const canvas = root.querySelector(".preview-canvas"), scale = Math.min(1, Math.max(0.15, (canvas.clientWidth - 32) / deviceWidth));
      frame.style.width = deviceWidth + "px";
      frame.style.zoom = String(scale);
      frame.style.height = Math.round(760 / scale) + "px";
    };
    const resize = new ResizeObserver(() => {
      if (root.isConnected) fitPreview();
      else resize.disconnect();
    });
    resize.observe(root.querySelector(".preview-canvas"));
    fitPreview();
    function list() {
      root.querySelector("#section-list").innerHTML = draft.sections.filter((x) => defaults.includes(x.id)).map((x) => {
        const i = draft.sections.indexOf(x);
        return `<div class="section-control"><label><input type="checkbox" data-section-toggle="${x.id}" ${x.enabled ? "checked" : ""} ${write ? "" : "disabled"}>${sectionNames[x.id]}</label><div><button type="button" data-move="${i}" data-dir="-1" aria-label="Move ${sectionNames[x.id]} up" ${i === 0 || !write ? "disabled" : ""}>\u2191</button><button type="button" data-move="${i}" data-dir="1" aria-label="Move ${sectionNames[x.id]} down" ${i === draft.sections.length - 1 || !write ? "disabled" : ""}>\u2193</button></div></div>`;
      }).join("");
    }
    async function update() {
      const ticket = ++request;
      status.textContent = "Updating preview\u2026";
      try {
        const r = await api("/tenants/" + t.id + "/render", "POST", { settings: draft });
        if (ticket !== request || !root.isConnected) return;
        frame.srcdoc = r.html;
        status.textContent = "Unsaved draft preview";
      } catch (e) {
        if (ticket === request) status.textContent = e.message;
      }
    }
    function changed() {
      context.dirty = true;
      status.textContent = "Unsaved edits";
      clearTimeout(timer);
      timer = setTimeout(update, 400);
    }
    list();
    root.querySelector("#editor-fields").onsubmit = (e) => e.preventDefault();
    root.querySelector("#editor-fields").oninput = (e) => {
      if (!write) return;
      draft[e.target.name] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      changed();
    };
    root.querySelector("#editor-fields").onchange = (e) => {
      if (e.target.name === "template") {
        status.textContent = "Save draft to refresh the available section list.";
      }
    };
    root.addEventListener("change", (e) => {
      const id = e.target.dataset.sectionToggle;
      if (id) {
        draft.sections.find((x) => x.id === id).enabled = e.target.checked;
        if (id === "about") draft.showOwner = e.target.checked;
        if (id === "area" || id === "projects") draft.showProjects = e.target.checked;
        changed();
      }
    });
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.device) {
        deviceWidth = parseInt(b.dataset.device);
        fitPreview();
        root.querySelectorAll("[data-device]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      }
      if (b.dataset.move !== void 0) {
        const i = Number(b.dataset.move), j = i + Number(b.dataset.dir);
        if (draft.sections[j]) {
          [draft.sections[i], draft.sections[j]] = [draft.sections[j], draft.sections[i]];
          list();
          changed();
        }
      }
    });
    root.querySelector("#customize-toggle").onclick = () => root.querySelector("#customize-panel").classList.toggle("collapsed");
    if (!write) root.querySelectorAll("#editor-fields input,#editor-fields textarea,#editor-fields select").forEach((x) => x.disabled = true);
    if (write) {
      root.querySelector("#editor-reset").onclick = () => {
        if (context.dirty && !confirm("Discard unsaved visual-editor edits?")) return;
        clearTimeout(timer);
        context.dirty = false;
        startEditor(write);
      };
      root.querySelector("#editor-save").onclick = () => task(async () => {
        clearTimeout(timer);
        const r = await api("/tenants/" + t.id, "PUT", { settings: draft, version: t.version });
        context.current.tenant = r.tenant;
        context.dirty = false;
        await refresh();
        await renderSite();
        notify("Visual changes saved as draft. Publish when reviewed.");
      });
    }
  }
  return { start: startEditor };
}
export {
  createVisualEditor
};
