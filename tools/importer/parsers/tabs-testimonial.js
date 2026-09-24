/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-24
 *
 * Library structure (Tabs): 2 columns; row 1 = block name; each subsequent row is
 * one tab: cell 1 = Tab Label (mandatory), cell 2 = Tab Content (mandatory).
 * Source has a `.tabs-content` container of `.tab-pane` panels and a `.tab-menu`
 * container of `button.tab-menu-link` labels. Pair each pane with its menu button
 * by index (data-tab-index / data-tab-target).
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content > .tab-pane'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu button.tab-menu-link, .tab-menu-link'));

  // Empty-block guard.
  if (!panes.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  panes.forEach((pane, i) => {
    // Label: prefer the matching menu button's inner content; fall back to index text.
    const button = menuButtons[i];
    const labelCell = button
      ? Array.from(button.childNodes)
      : [`Tab ${i + 1}`];
    // Content: full pane content.
    const contentCell = Array.from(pane.childNodes);
    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
