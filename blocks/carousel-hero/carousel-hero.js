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
    // off-screen slides are hidden from screen readers and removed from tab order
    if (i !== 0) {
      row.setAttribute('aria-hidden', 'true');
      row.inert = true;
    }

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.classList.add('carousel-hero-image');
      } else if (cell.textContent.trim() || cell.querySelector('a')) {
        cell.classList.add('carousel-hero-content');
      } else {
        // empty content cell (image-only slide) — drop it so no white panel renders
        cell.remove();
      }
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
    const next = (idx + slides.length) % slides.length;
    slides[current].setAttribute('aria-hidden', 'true');
    slides[current].inert = true;
    slides[next].removeAttribute('aria-hidden');
    slides[next].inert = false;
    [...nav.children].forEach((d, di) => d.setAttribute('aria-selected', di === next ? 'true' : 'false'));
    track.style.transform = `translateX(-${next * 100}%)`;
    current = next;
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

  // prev/next arrows (bottom-right, like WKND)
  const arrows = document.createElement('div');
  arrows.className = 'carousel-hero-arrows';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-hero-arrow carousel-hero-arrow-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<span aria-hidden="true">&#8592;</span>';
  prev.addEventListener('click', () => show(current - 1));
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-hero-arrow carousel-hero-arrow-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<span aria-hidden="true">&#8594;</span>';
  next.addEventListener('click', () => show(current + 1));
  arrows.append(prev, next);
  block.append(arrows);
}
