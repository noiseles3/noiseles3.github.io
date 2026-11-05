(() => {
  'use strict';
  const banner = document.querySelector('.channel-banner');
  const toggle = document.getElementById('motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let paused = false;
  const animations = new Set();
  const seen = new WeakSet();
  const allowed = () => !paused && !preference.matches;
  const stopReveals = () => { animations.forEach(animation => animation.finish()); animations.clear(); };
  toggle.addEventListener('click', () => {
    paused = !paused;
    document.body.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Включить анимацию' : 'Остановить анимацию';
    if (paused) stopReveals();
  });
  preference.addEventListener('change', () => { if (preference.matches) stopReveals(); });
  banner.addEventListener('pointermove', event => {
    if (!allowed() || !finePointer.matches) return;
    const bounds = banner.getBoundingClientRect();
    banner.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 12}px`);
    banner.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 8}px`);
  }, { passive: true });
  banner.addEventListener('pointerleave', () => {
    banner.style.setProperty('--pointer-x', '0px');
    banner.style.setProperty('--pointer-y', '0px');
  });
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(entries => {
    banner.classList.toggle('banner-offscreen', !entries[0].isIntersecting);
  }).observe(banner);
  const reveal = new IntersectionObserver(entries => {
    let delay = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal.unobserve(entry.target);
      if (!allowed()) return;
      const animation = entry.target.animate([
        { opacity: 0, transform: 'translateY(22px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, delay: delay++ * 70, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    });
  }, { threshold: .08 });
  const grid = document.getElementById('projects-grid');
  const observeCards = () => {
    grid.querySelectorAll('.project-card').forEach(card => {
      if (seen.has(card)) return;
      seen.add(card);
      reveal.observe(card);
    });
  };
  new MutationObserver(observeCards).observe(grid, { childList: true });
  observeCards();
})();
