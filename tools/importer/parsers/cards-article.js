/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-24
 *
 * Library structure (Cards): 2 columns; row 1 = block name; each subsequent row is a
 * card: cell 1 = Image (mandatory), cell 2 = text (meta, title, optional CTA).
 *
 * The repeating unit is `a.article-card.card-link` — an anchor wrapping block content.
 * Although structure.json reports iterationSafe:true, html2md's preProcess can merge
 * adjacent sibling anchors, so we iterate the stable inner wrapper `.article-card-body`
 * and pair each with its sibling `.article-card-image`. The card href is preserved by
 * re-attaching it to the card heading as a link.
 */
export default function parse(element, { document }) {
  // Iterate inner block wrappers (immune to the anchor-merge trap).
  let items = Array.from(element.querySelectorAll(':scope > a .article-card-body')).map((body) => ({
    body,
    image: body.parentElement?.querySelector('.article-card-image'),
    href: body.closest('a')?.getAttribute('href'),
  }));

  // Fallback: iterate the anchors directly if the inner wrappers are absent.
  if (!items.length) {
    items = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link')).map((card) => ({
      body: card.querySelector('.article-card-body'),
      image: card.querySelector('.article-card-image'),
      href: card.getAttribute('href'),
    }));
  }

  // Empty-block guard.
  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach(({ body, image, href }) => {
    const imageCell = image ? (image.querySelector('img') || image) : '';

    const contentCell = [];
    if (body) {
      const meta = body.querySelector('.article-card-meta');
      if (meta) contentCell.push(meta);
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        // Preserve the card link by wrapping the heading text in an anchor.
        if (href) {
          const link = document.createElement('a');
          link.setAttribute('href', href);
          link.textContent = heading.textContent.trim();
          heading.textContent = '';
          heading.append(link);
        }
        contentCell.push(heading);
      }
    }

    cells.push([imageCell, contentCell.length ? contentCell : '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
