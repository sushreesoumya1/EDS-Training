/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo. Base block: hero.
 * Source: https://wknd.site/ (AEM Core Components .cmp-teaser--hero markup).
 * Generated: 2026-09-24
 *
 * Library structure: 1 column, 3 rows. First row = block name.
 * Row 2 (single cell) = background image.
 * Row 3 (single cell) = title (heading) + subheading + CTA.
 *
 * Source: .cmp-teaser with .cmp-teaser__content (title/description/action)
 * and .cmp-teaser__image (the hero photo).
 */
export default function parse(element, { document }) {
  // Background image (row 2, single cell).
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Content (row 3, single cell): heading + description + CTA.
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  const description = element.querySelector('.cmp-teaser__description, p');
  const ctas = [...element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a')];

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctas);

  // Empty-block guard.
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 2: image cell (single column). Add only when present.
  if (image) cells.push([image]);
  // Row 3: content cell (single column, holds all text + CTA).
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
