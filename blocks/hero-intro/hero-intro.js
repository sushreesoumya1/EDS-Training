import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the hero-intro block
 * A two-column page-intro banner: heading, supporting text and CTAs on one
 * side, alongside a cluster of images on the other.
 * @param {Element} block The hero-intro block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // First cell that has no image is treated as the text column;
  // any cell containing images is treated as the media/image cluster.
  const textCol = document.createElement('div');
  textCol.className = 'hero-intro-text';

  const mediaCol = document.createElement('div');
  mediaCol.className = 'hero-intro-media';

  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        [...cell.children].forEach((child) => mediaCol.append(child));
      } else {
        [...cell.children].forEach((child) => textCol.append(child));
      }
    });
  });

  // Optimize any images in the media cluster.
  mediaCol.querySelectorAll('img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const picture = img.closest('picture');
    if (picture) {
      picture.replaceWith(optimized);
    } else {
      img.replaceWith(optimized);
    }
  });

  block.textContent = '';
  block.append(textCol);
  if (mediaCol.children.length) block.append(mediaCol);
}
