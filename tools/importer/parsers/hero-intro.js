/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-intro. Base: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-24
 *
 * Library structure (Hero): 1 column, 3 rows.
 *   Row 1: block name.
 *   Row 2: background image(s) (optional).
 *   Row 3: title (heading), subheading, call-to-action links (optional).
 */
export default function parse(element, { document }) {
  // Content block-level children: heading, subheading, CTA buttons.
  const heading = element.querySelector('h1, h2, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p, [class*="subheading"]');
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button'),
  );

  // Media: one or more cover images.
  const images = Array.from(
    element.querySelectorAll('img.cover-image, img'),
  );

  // Empty-block guard.
  if (!heading && !subheading && !images.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image(s).
  if (images.length) {
    cells.push([images]);
  }

  // Row 3: title, subheading, CTAs (single cell holding all content elements).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-intro', cells });
  element.replaceWith(block);
}
