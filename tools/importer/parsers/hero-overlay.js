/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-24
 *
 * Library structure (Hero): 1 column, 3 rows.
 *   Row 1: block name.
 *   Row 2: background image (optional).
 *   Row 3: title (heading), subheading, call-to-action (optional).
 * Source: a relative container with a `.cover-image` overlay image, an empty
 * `.overlay` scrim, and a `.card-body` holding the heading, subheading and CTA.
 */
export default function parse(element, { document }) {
  // Background image (the cover/overlay image).
  const bgImage = element.querySelector('img.cover-image, img');

  // Text content lives in the card body.
  const body = element.querySelector('.card-body') || element;
  const heading = body.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = body.querySelector('p.subheading, p, [class*="subheading"]');
  const ctaLinks = Array.from(body.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard.
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image.
  if (bgImage) cells.push([bgImage]);

  // Row 3: title, subheading, CTAs in a single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
