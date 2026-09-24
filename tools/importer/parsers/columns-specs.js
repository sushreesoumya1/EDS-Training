/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-specs. Base block: columns.
 * Source: https://wknd.site/ca/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-24
 *
 * Library structure (Columns): first row = block name; subsequent rows have a
 * consistent number of columns (each cell becomes a responsive grid column).
 * This variant renders a vertical list of label/value spec rows, so each spec
 * is a 2-column row: cell 1 = label, cell 2 = value.
 * decorate() marks cell[0] as .columns-specs-label and cell[1] as .columns-specs-value.
 *
 * Source: <dl class="cmp-contentfragment__elements"> with repeating
 * <div class="cmp-contentfragment__element"> each holding a
 * <dt class="cmp-contentfragment__element-title"> (label) and a
 * <dd class="cmp-contentfragment__element-value"> (value).
 * No nested interactive elements — the .cmp-contentfragment__element divs are
 * a safe iteration target.
 */
export default function parse(element, { document }) {
  // Iterate the spec rows. Prefer the explicit element wrappers; fall back to
  // pairing dt/dd directly if the wrappers are absent.
  let rows = [...element.querySelectorAll('.cmp-contentfragment__element')].map((el) => ({
    label: el.querySelector('.cmp-contentfragment__element-title, dt'),
    value: el.querySelector('.cmp-contentfragment__element-value, dd'),
  }));

  if (!rows.length) {
    const dts = [...element.querySelectorAll('dt')];
    rows = dts.map((dt) => ({
      label: dt,
      value: dt.nextElementSibling && dt.nextElementSibling.tagName === 'DD'
        ? dt.nextElementSibling
        : null,
    }));
  }

  // Empty-block guard.
  if (!rows.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  rows.forEach(({ label, value }) => {
    const labelCell = label ? label.textContent.trim() : '';
    const valueCell = value ? value.textContent.trim() : '';
    cells.push([labelCell, valueCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-specs', cells });
  element.replaceWith(block);
}
