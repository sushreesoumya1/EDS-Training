import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Promo hero: a full-width image row followed by a text row
 * (heading, body copy, CTA link).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    if (row.querySelector('picture')) row.classList.add('hero-promo-image');
    else row.classList.add('hero-promo-content');
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]));
  });
}
