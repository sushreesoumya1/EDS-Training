import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Featured article band: a large image beside a text column
 * (eyebrow label, heading, body copy, CTA link).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (col.querySelector('picture')) col.classList.add('columns-featured-image');
      else col.classList.add('columns-featured-content');
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
  });
}
