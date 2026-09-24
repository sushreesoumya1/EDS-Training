import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Author byline: circular avatar beside the author's name and role.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  [...row.children].forEach((cell) => {
    if (cell.querySelector('picture')) cell.classList.add('columns-author-avatar');
    else cell.classList.add('columns-author-info');
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '120' }]));
  });

  // absorb trailing social links (rendered as buttons by decorateButtons) into
  // the author block and present them as a compact plain-text link row.
  // The links live in the next content wrapper as single-link paragraphs.
  const social = document.createElement('div');
  social.className = 'columns-author-social';
  const wrapper = block.closest('.columns-author-wrapper') || block.parentElement;
  const nextWrapper = wrapper?.nextElementSibling;
  const scope = nextWrapper && nextWrapper.classList.contains('default-content-wrapper')
    ? nextWrapper : null;
  if (scope) {
    scope.querySelectorAll(':scope > p').forEach((p) => {
      const link = p.querySelector(':scope > a');
      if (link && p.textContent.trim() === link.textContent.trim()) {
        link.className = '';
        social.append(link);
        p.remove();
      }
    });
    if (!scope.children.length) scope.remove();
  }
  if (social.children.length) row.append(social);
}
