import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Rotating hero carousel. Each row is a slide made of an image cell and a
 * text cell (heading, description, optional CTA link).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const slides = [...block.children];

  const track = document.createElement('div');
  track.className = 'carousel-hero-track';

  slides.forEach((row, i) => {
    row.classList.add('carousel-hero-slide');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-roledescription', 'slide');
    row.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    if (i !== 0) row.setAttribute('aria-hidden', 'true');

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) cell.classList.add('carousel-hero-image');
      else cell.classList.add('carousel-hero-content');
    });

    track.append(row);
  });

  // optimize images (eager-load the first slide for LCP)
  track.querySelectorAll('picture > img').forEach((img, idx) => {
    const optimized = createOptimizedPicture(img.src, img.alt, idx === 0, [{ width: '2000' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(track);

  if (slides.length <= 1) return;

  // navigation dots
  const nav = document.createElement('div');
  nav.className = 'carousel-hero-nav';
  nav.setAttribute('role', 'tablist');

  let current = 0;
  const show = (idx) => {
    slides[current].setAttribute('aria-hidden', 'true');
    slides[idx].removeAttribute('aria-hidden');
    [...nav.children].forEach((d, di) => d.setAttribute('aria-selected', di === idx ? 'true' : 'false'));
    track.style.transform = `translateX(-${idx * 100}%)`;
    current = idx;
  };

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-hero-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => show(i));
    nav.append(dot);
  });

  block.append(nav);
}
