/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base block: columns.
 * Source: https://wknd.site/ (AEM Core Components .cmp-teaser--featured markup).
 * Generated: 2026-09-24
 *
 * Library structure: multiple columns / rows. First row = block name.
 * This variant is a single two-column row: [image cell, text cell].
 * Text cell holds eyebrow (pretitle), heading, description and CTA.
 *
 * Source: .cmp-teaser with .cmp-teaser__content (pretitle/title/description/action)
 * and .cmp-teaser__image (the featured photo).
 */
export default function parse(element, { document }) {
  // Image cell (first column).
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Text cell (second column): eyebrow + heading + description + CTA.
  const pretitle = element.querySelector('.cmp-teaser__pretitle');
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  const description = element.querySelector('.cmp-teaser__description, p:not(.cmp-teaser__pretitle)');
  const ctas = [...element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a')];

  const textCell = [];
  if (pretitle) textCell.push(pretitle);
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  textCell.push(...ctas);

  // Empty-block guard.
  if (!image && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
