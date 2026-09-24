import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Person-card grid (contributors / guides). Each row is one person:
 * image, name (h3), role (h5), and social links.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-author-item';

    const media = document.createElement('div');
    media.className = 'cards-author-image';
    const body = document.createElement('div');
    body.className = 'cards-author-body';

    // a single-cell row holds everything for one person
    const cell = row.firstElementChild || row;
    const pic = cell.querySelector('picture');
    if (pic) media.append(pic);

    const social = document.createElement('div');
    social.className = 'cards-author-social';

    [...cell.children].forEach((el) => {
      if (el.querySelector && el.querySelector('picture')) return;
      const link = el.tagName === 'P' && el.querySelector(':scope > a');
      if (link && el.textContent.trim() === link.textContent.trim()) {
        link.className = '';
        social.append(link);
      } else if (el.tagName !== 'P' || el.textContent.trim()) {
        body.append(el);
      }
    });
    if (social.children.length) body.append(social);

    li.append(media, body);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]));
  });

  block.replaceChildren(ul);
}
