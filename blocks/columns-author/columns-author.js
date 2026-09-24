import { createOptimizedPicture } from '../../scripts/aem.js';

/* inline SVG glyphs keyed by platform (no external assets required) */
const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V4a20 20 0 0 0-2.5-.1c-2.4 0-4 1.5-4 4.2V10H8v3h2.5v8h3z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4 4 0 0 1-1.8 0 4.1 4.1 0 0 0 3.8 2.9A8.3 8.3 0 0 1 2 18.3a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.1.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.1-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.1-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.1 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 8.5 2.6 8.9 2.6 12s0 3.5.1 4.7c0 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1.1-.2-1.7-.4-2.1a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.3-8.2a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg>',
};

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
        // swap the text label for the matching social icon (label kept for a11y)
        const label = link.textContent.trim();
        const icon = SOCIAL_ICONS[label.toLowerCase()];
        if (icon) {
          link.setAttribute('aria-label', label);
          link.innerHTML = icon;
        }
        link.className = '';
        social.append(link);
        p.remove();
      }
    });
    if (!scope.children.length) scope.remove();
  }
  if (social.children.length) row.append(social);
}
