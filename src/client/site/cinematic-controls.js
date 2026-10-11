(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function arrowSelection(selector) {
    const items = all(selector);
    items.forEach((item, index) => item.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % items.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + items.length - 1) % items.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = items.length - 1;
      if (next !== undefined) { event.preventDefault(); items[next].focus(); items[next].click(); }
    }));
  }
  const stories = {
    shingle: { title: 'Shingle installation', description: 'From preparation to the finished covering. Explore two illustrative stock views.', before: 'roofing.jpg', after: 'finished-roof.jpg', left: 'INSTALLATION / STOCK', right: 'FINISHED SHINGLES / STOCK', beforeAlt: 'Stock roofing installation with shingles and underlayment', afterAlt: 'Stock coastal house with completed asphalt shingle roofing' },
    replacement: { title: 'Roof replacement', description: 'A look at replacement work and a finished shingle roof on a different property.', before: 'roof-repair.jpg', after: 'finished-roof.jpg', left: 'REPLACEMENT WORK / STOCK', right: 'FINISHED ROOF / STOCK', beforeAlt: 'Stock crew replacing roofing on a house', afterAlt: 'Stock house with completed shingle roofing' },
    barrier: { title: 'Weather barrier', description: 'Explore the transition from structural roof decking to protective underlayment.', before: 'decking.jpg', after: 'underlayment.jpg', left: 'DECKING / STOCK', right: 'UNDERLAYMENT / STOCK', beforeAlt: 'Construction photograph showing plywood roof decking', afterAlt: 'Stock roofing photograph with synthetic underlayment visible below shingles' },
    flashing: { title: 'Flashing details', description: 'Explore a roof-wide view and a close-up of the flashing around a chimney.', before: 'decking.jpg', after: 'flashing.jpg', left: 'ROOF STRUCTURE / STOCK', right: 'CHIMNEY FLASHING / STOCK', beforeAlt: 'Roof structure and plywood during construction', afterAlt: 'Example of sheet-metal chimney flashing on a metal roof' },
    metal: { title: 'Metal roofing', description: 'Two different metal-roof perspectives: a structural view and an exterior detail.', before: 'metal.jpg', after: 'flashing.jpg', left: 'STRUCTURAL VIEW / STOCK', right: 'EXTERIOR DETAIL / STOCK', beforeAlt: 'Stock metal roofing structure from below', afterAlt: 'Metal roof exterior and chimney flashing detail' }
  };
  const comparison = $('.compare');
  let comparisonRequest = 0;
  const loadPhoto = (src) => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(src); image.onerror = reject; image.src = src; });
  async function selectComparison(key, manual = true) {
    const story = stories[key]; if (!comparison || !story) return false;
    const request = ++comparisonRequest;
    comparison.classList.add('is-loading'); comparison.setAttribute('aria-busy', 'true');
    try {
      await Promise.all([loadPhoto('/assets/' + story.before), loadPhoto('/assets/' + story.after)]);
      if (request !== comparisonRequest) return false;
      const leftImage = $('.compare-overlay img'), rightImage = $('.compare > img');
      leftImage.src = '/assets/' + story.before; leftImage.alt = story.beforeAlt;
      rightImage.src = '/assets/' + story.after; rightImage.alt = story.afterAlt;
      $('.compare-label.left').textContent = story.left; $('.compare-label.right').textContent = story.right;
      $('#comparison-title').textContent = story.title; $('#comparison-description').textContent = story.description;
      all('[data-comparison]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.comparison === key)));
      const range = $('.compare input'); range.value = '50'; comparison.style.setProperty('--reveal', '50%');
      range.setAttribute('aria-label', 'Reveal ' + story.title + ' stock comparison');
      if (manual) range.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    } catch {
      if (request === comparisonRequest) $('#comparison-description').textContent = 'That image could not load. Please try selecting the story again.';
      return false;
    } finally {
      if (request === comparisonRequest) { comparison.classList.remove('is-loading'); comparison.setAttribute('aria-busy', 'false'); }
    }
  }
  all('[data-comparison]').forEach(button => button.addEventListener('click', () => selectComparison(button.dataset.comparison)));
  arrowSelection('[data-comparison]'); selectComparison('shingle', false);
  const processSteps = [["The problem","Something needs attention.","Tell the team what you’ve noticed: a leak, damage, wear, or plans for something new."],["The inspection","Look beneath the surface.","Discuss an inspection to understand your roof’s condition."],["The recommendation","Understand your options.","Talk through repair or replacement options and the scope of work."],["The installation","Put the plan to work.","Agree on the materials, schedule, and work before the project begins."],["The finished roof","Look ahead with confidence.","Review the completed work and discuss ongoing roof maintenance."]];
  function selectStep(index) {
    if (!Number.isInteger(index) || !processSteps[index]) return false;
    const step = processSteps[index];
    all('[data-step]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.step) === index)));
    $('.process-detail-number').textContent = String(index + 1).padStart(2, '0');
    $('#process-detail h3').textContent = step[0]; $('.process-detail-copy').textContent = step[2];
    return true;
  }
  all('[data-step]').forEach(button => button.addEventListener('click', () => selectStep(Number(button.dataset.step))));
  arrowSelection('[data-step]'); arrowSelection('[data-layer]');
  all('[data-layer]').forEach((button, index) => button.addEventListener('click', () => { $('#layer-name').textContent = String(index + 1).padStart(2, '0') + ' / ' + button.dataset.layer.toUpperCase(); }));

  window.RoblesPreview = Object.freeze({ selectComparison, selectStep });
})();
(() => {const scene=document.querySelector('.cutaway-art');if(!scene)return;const block=document.querySelector('.cutaway-story'),buttons=[...document.querySelectorAll('[data-scene][aria-pressed]')],titles=['01 / Find the vulnerable transition','02 / Protect the junction','03 / Give water a route away'],copy=['Where the chimney meets the roof, gaps can create a path for water.','The highlighted junction shows where properly detailed flashing helps protect the roof transition.','The arrows show the intended route over the roof covering, away from the chimney junction.'];let manual=false,queued=false;function select(n){scene.dataset.scene=n;buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));document.querySelector('#cutaway-title').textContent=titles[n];document.querySelector('#cutaway-copy').textContent=copy[n]}buttons.forEach((b,i)=>b.addEventListener('click',()=>{manual=true;select(i)}));if(!matchMedia('(prefers-reduced-motion:reduce)').matches)window.addEventListener('scroll',()=>{if(manual||queued||innerWidth<800||document.body.classList.contains('motion-paused'))return;queued=true;requestAnimationFrame(()=>{const box=block.getBoundingClientRect();if(box.top<innerHeight&&box.bottom>0)select(Math.min(2,Math.max(0,Math.floor(-box.top/(box.height-innerHeight)*3))));queued=false})},{passive:true})})();
