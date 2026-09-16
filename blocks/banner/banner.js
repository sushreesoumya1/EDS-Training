import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: Image
  const imageRow = rows[0];
  // Row 1: Title
  const titleRow = rows[1];
  // Row 2 (optional): Background color
  const bgColorRow = rows[2];

  // Resolve background color (default to blue)
  const bgColor = bgColorRow ? bgColorRow.textContent.trim() : '';
  block.style.backgroundColor = bgColor || 'blue';

  // Build image wrapper
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'banner-image';
  if (imageRow) {
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1200' }]);
        imageWrapper.append(optimized);
      } else {
        imageWrapper.append(picture);
      }
    }
  }

  // Build content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'banner-content';
  if (titleRow) {
    while (titleRow.firstElementChild) {
      contentWrapper.append(titleRow.firstElementChild);
    }
    if (!contentWrapper.children.length) {
      const p = document.createElement('p');
      p.textContent = titleRow.textContent.trim();
      contentWrapper.append(p);
    }
  }

  // Replace block contents
  block.replaceChildren(imageWrapper, contentWrapper);
}
