/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article-header. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-24
 *
 * Library structure (Columns): row 1 = block name; row 2 = one cell per column.
 * Source is 2 direct-child columns: [image] | [breadcrumbs + heading + author/date].
 */
export default function parse(element, { document }) {
  // Two natural columns are the two direct children of the grid.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (columns.length < 2) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const leftCol = columns[0];
  const rightCol = columns[1];

  const cells = [];
  // Row 2: one cell per column, each holding its full content.
  cells.push([
    [...leftCol.childNodes],
    [...rightCol.childNodes],
  ]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article-header', cells });
  element.replaceWith(block);
}
