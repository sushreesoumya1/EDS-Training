/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-related. Base block: cards.
 * Source: https://wknd.site/us/en/magazine/*.html (AEM Core Components .cmp-list markup).
 * Generated: 2026-09-24
 *
 * Library structure (Cards, "no images" variant): 1 column, multiple rows.
 * First row = block name. Each subsequent row = one card body cell.
 * This variant is text-only (no images): each card cell holds a linked title
 * and a publication date.
 *
 * Source: ul.cmp-list > li.cmp-list__item. Each item holds an
 * a.cmp-list__item-link wrapping span.cmp-list__item-title and
 * span.cmp-list__item-date. Iteration key li.cmp-list__item is a stable,
 * block-level list item (structure.json: iterationSafe true, no warnings).
 */
export default function parse(element, { document }) {
  // Iterate the list items. li.cmp-list__item is the stable block-level unit.
  const items = [...element.querySelectorAll('li.cmp-list__item, .cmp-list__item')];

  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a.cmp-list__item-link, a');
    const titleEl = item.querySelector('.cmp-list__item-title');
    const dateEl = item.querySelector('.cmp-list__item-date');

    const titleText = (titleEl || link || item).textContent.trim();
    const href = link && link.getAttribute('href');
    const dateText = dateEl ? dateEl.textContent.trim() : '';

    // Skip empty items.
    if (!titleText && !dateText) return;

    const bodyCell = [];

    // Linked title.
    if (titleText) {
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleText;
        bodyCell.push(a);
      } else {
        bodyCell.push(titleText);
      }
    }

    // Publication date on its own line.
    if (dateText) {
      const p = document.createElement('p');
      p.textContent = dateText;
      bodyCell.push(p);
    }

    // Single-column (no-images) card row.
    cells.push([bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-related', cells });
  element.replaceWith(block);
}
