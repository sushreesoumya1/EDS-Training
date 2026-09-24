/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-author. Base block: columns.
 * Source: https://wknd.site/us/en/magazine/*.html (AEM Core Components .cmp-byline markup).
 * Generated: 2026-09-24
 *
 * Library structure (Columns): first row = block name; subsequent row = one cell
 * per column. This variant is a single two-column row:
 * [avatar image cell | text cell (name + role)].
 *
 * Source: div.byline.image > div.cmp-byline containing div.cmp-byline__image img,
 * h2.cmp-byline__name and p.cmp-byline__occupations.
 * No repeating unit (structure.json: single row, no warnings).
 */
export default function parse(element, { document }) {
  // Image cell (first column): the avatar.
  const image = element.querySelector('.cmp-byline__image img, .cmp-image__image, img');

  // Text cell (second column): author name + role.
  const name = element.querySelector('.cmp-byline__name, h1, h2, h3');
  const role = element.querySelector('.cmp-byline__occupations, p');

  const textCell = [];
  if (name) textCell.push(name);
  if (role) textCell.push(role);

  // Empty-block guard.
  if (!image && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-author', cells });
  element.replaceWith(block);
}
