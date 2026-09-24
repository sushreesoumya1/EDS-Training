/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-24
 *
 * Library structure (Accordion): 2 columns; row 1 = block name; each subsequent row
 * is one item: cell 1 = Title (mandatory), cell 2 = Content (mandatory).
 * Source repeating unit: `details.faq-item` (iterationSafe), each with a
 * `summary.faq-question` (question text + toggle icon) and a `.faq-answer`.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope details.faq-item'));

  // Empty-block guard.
  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary.faq-question, summary');
    const answer = item.querySelector('.faq-answer');

    // Title: prefer the question text node (span), drop the decorative toggle icon.
    let titleCell = '';
    if (summary) {
      const questionText = summary.querySelector('span');
      if (questionText) {
        titleCell = questionText;
      } else {
        // Fall back to summary text without the svg icon.
        const clone = summary.cloneNode(true);
        clone.querySelectorAll('svg').forEach((svg) => svg.remove());
        titleCell = clone.textContent.trim();
      }
    }

    const contentCell = answer ? Array.from(answer.childNodes) : '';
    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
