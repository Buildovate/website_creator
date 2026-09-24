(() => {
  const el = document.querySelector('[data-review-slug]');
  if (!el) return;
  const button = el.querySelector('[data-load-reviews]');
  const status = el.querySelector('[data-review-status]');
  const target = el.querySelector('[data-review-results]');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hideEmpty = el.dataset.hideEmptyReviews === 'true';
  const wrapper = hideEmpty ? el.closest('[data-service-reviews]') : null;

  function card(review, provider) {
    const words = String(review.text || '').trim().split(/\s+/);
    const quote = words.slice(0, 30).join(' ') + (words.length > 30 ? '…' : '');
    const rating = Number.isFinite(review.rating) && review.rating >= 0 && review.rating <= 5 ? review.rating : null;
    const stars = rating === null ? '' : `<span class="review-stars" role="img" aria-label="${rating} out of 5 stars"><span aria-hidden="true">${'★'.repeat(Math.round(rating))}${'☆'.repeat(5 - Math.round(rating))}</span><b aria-hidden="true">${rating} / 5</b></span>`;
    return `<article class="source-review-card">${stars}<blockquote>${esc(quote)}</blockquote><div class="review-byline">${review.avatar ? `<img src="${esc(review.avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}<div><a class="review-author" href="${esc(review.authorUrl || review.url || provider.url)}" target="_blank" rel="noopener">${esc(review.author)}</a>${review.date || review.visitDate ? `<small>${esc(review.date)}${review.visitDate ? ' · Visit: ' + esc(review.visitDate.month) + '/' + esc(review.visitDate.year) : ''}</small>` : ''}</div></div><a class="review-original" href="${esc(review.url || provider.url)}" target="_blank" rel="noopener">Read original on <span translate="no">${esc(provider.provider)}</span> ↗</a></article>`;
  }

  function providerSummary(provider, minimum) {
    if (provider.status) return `<article class="provider-reviews"><a class="provider-name" translate="no" href="${esc(provider.url)}" target="_blank" rel="noopener">${esc(provider.provider)} ↗</a><p>${el.dataset.reviewPreview === 'true' ? esc(provider.status) : 'Read customer feedback on the source profile.'}</p></article>`;
    const rating = Number.isFinite(provider.rating) ? Number(provider.rating).toFixed(1) + ' / 5' : '';
    const count = Number.isFinite(provider.count) ? provider.count + ' reviews' : '';
    return `<article class="provider-reviews"><a class="provider-name" translate="no" href="${esc(provider.url)}" target="_blank" rel="noopener">${esc(provider.provider)} ↗</a>${provider.name ? `<h3>${esc(provider.name)}</h3>` : ''}${rating || count ? `<p class="aggregate-rating">${[rating, count].filter(Boolean).join(' · ')}</p><p>Overall provider rating, independent of featured reviews.</p>` : ''}<p>${provider.provider === 'Google Maps' ? `Google’s relevance-ranked sample${minimum ? ' · selected 4+ star reviews' : ''}.` : 'Available Yelp excerpts. See the source for all reviews.'}</p>${(provider.attributions || []).map(a => `<a href="${esc(a.url)}" rel="noopener">${esc(a.name)}</a>`).join('')}${provider.privacyUrl ? `<p><a href="${esc(provider.privacyUrl)}">Privacy policy</a> · <a href="${esc(provider.termsUrl)}">Terms of use</a></p>` : ''}</article>`;
  }

  button.onclick = async () => {
    button.disabled = true;
    status.textContent = 'Loading current provider data…';
    try {
      const response = await fetch('/api/public/' + encodeURIComponent(el.dataset.reviewSlug) + '/reviews' + (el.dataset.reviewPreview === 'true' ? '?preview=1' : ''));
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      if (hideEmpty) {
        data.providers = data.providers.filter(p => (p.reviews || []).length > 0);
        if (wrapper) wrapper.hidden = !data.providers.length;
      }
      const cards = data.providers.flatMap(p => p.status ? [] : (p.reviews || []).map(review => card(review, p)));
      target.innerHTML = (cards.length ? `<div class="review-grid source-review-grid">${cards.join('')}</div>` : '') + `<div class="review-provider-notes">${data.providers.map(p => providerSummary(p, data.minimum)).join('')}</div>`;
      // Source reviews stay still so the quote, author and source remain readable together.
      status.textContent = data.providers.some(p => !p.status) ? 'Follow the source links for all reviews.' : 'Read customer feedback directly on the linked profiles.';
    } catch (error) {
      if (wrapper) wrapper.hidden = true;
      target.innerHTML = '';
      status.textContent = 'Reviews are temporarily unavailable. Read them at the source links.';
    } finally {
      button.disabled = false;
    }
  };
  if (hideEmpty || !('IntersectionObserver' in window)) {
    button.click();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      observer.disconnect();
      button.click();
    }
  }, {rootMargin:'180px'});
  observer.observe(el);
})();
