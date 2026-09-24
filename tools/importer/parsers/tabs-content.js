/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-content. Base block: tabs.
 * Source: https://wknd.site/ca/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-24
 *
 * Library structure (Tabs): 2 columns. First row = block name. Each subsequent
 * row is one tab: cell 1 = Tab Label (mandatory), cell 2 = Tab Content
 * (mandatory: paragraphs, images, lists, links). decorate() builds a tablist of
 * buttons + panels keyed by index.
 *
 * Source: <div class="cmp-tabs"> with an <ol class="cmp-tabs__tablist"> of
 * <li class="cmp-tabs__tab"> labels (Overview, Itinerary, What to Bring) and
 * sibling <div class="cmp-tabs__tabpanel"> panels. Pair each panel with its
 * label by document order / index.
 * The tab labels are <li> (not interactive) and panels are plain divs — no
 * nested-interactive iteration trap. Panels are the iteration target.
 */
export default function parse(element, { document }) {
  const labels = [...element.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab, .cmp-tabs__tab')];
  const panels = [...element.querySelectorAll('.cmp-tabs__tabpanel')];

  // Empty-block guard.
  if (!panels.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  panels.forEach((panel, i) => {
    const label = labels[i];
    // Label cell: prefer the matching tab label's text; fall back to a generated label.
    const labelCell = label ? label.textContent.trim() : `Tab ${i + 1}`;
    // Drop the content-fragment title that repeats the page name inside each panel.
    panel.querySelectorAll('.cmp-contentfragment__title').forEach((t) => t.remove());
    // Content cell: the full panel content (paragraphs, images, lists, links).
    const contentCell = [...panel.childNodes];
    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-content', cells });
  element.replaceWith(block);
}
