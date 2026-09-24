/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards.
 * Source: https://wknd.site/ (AEM Core Components .cmp-image-list markup).
 * Generated: 2026-09-24
 *
 * Regenerated for WKND's .cmp-image-list markup (previous version targeted the
 * unrelated .article-card markup from a different site — overwritten here).
 *
 * Library structure: 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one card: [image cell, body cell].
 * Body cell holds the title (as a heading link) and the description.
 *
 * Source: ul.cmp-image-list > li.cmp-image-list__item. Each item holds an
 * .cmp-image-list__item-image-link (image), a .cmp-image-list__item-title-link
 * (title span) and a .cmp-image-list__item-description.
 */
export default function parse(element, { document }) {
  // Iterate the list items. li.cmp-image-list__item is a safe, stable iteration
  // key (block-level list item) per structure.json — not a nested interactive el.
  const items = [...element.querySelectorAll('li.cmp-image-list__item, .cmp-image-list__item')];

  const cells = [];

  items.forEach((item) => {
    // Image cell (first column).
    const image = item.querySelector('.cmp-image-list__item-image img, .cmp-image__image, img');

    // Body cell (second column): title (linked heading) + description.
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const description = item.querySelector('.cmp-image-list__item-description');

    const bodyCell = [];
    if (titleLink || titleSpan) {
      // Promote the linked title to a heading while preserving the link.
      const titleText = (titleSpan || titleLink).textContent.trim();
      const href = titleLink && titleLink.getAttribute('href');
      const heading = document.createElement('h3');
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = titleText;
        heading.append(link);
      } else {
        heading.textContent = titleText;
      }
      bodyCell.push(heading);
    }
    if (description) bodyCell.push(description);

    // Skip items with no content.
    if (!image && !bodyCell.length) return;

    cells.push([image || '', bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
