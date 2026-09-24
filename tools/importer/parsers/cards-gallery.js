/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-24
 *
 * Library structure (Cards): row 1 = block name; each subsequent row is one card.
 * This gallery has image-only cards (no headings/text). Iterate the safe repeating
 * unit `div.utility-aspect-1x1` (8 cards) and place each card's image in a row.
 */
export default function parse(element, { document }) {
  // Repeating unit: image tiles (iterationSafe per structure.json).
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('img');
    // Any optional text content in the card (none expected for this gallery).
    const text = Array.from(card.children).filter((el) => el.tagName !== 'IMG' && !el.querySelector('img'));
    const contentCell = [];
    if (text.length) contentCell.push(...text);
    // Row per card: image cell + text cell (text may be empty for image-only cards).
    cells.push([img || '', contentCell.length ? contentCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
