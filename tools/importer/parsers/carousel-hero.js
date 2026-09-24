/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base block: carousel.
 * Source: https://wknd.site/ (AEM Core Components .cmp-carousel markup).
 * Generated: 2026-09-24
 *
 * Library structure: 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one slide: [image cell, content cell].
 * Content cell holds the title (heading), description and CTA link.
 *
 * Source: .cmp-carousel > .cmp-carousel__content > .cmp-carousel__item (one per slide).
 * Each item wraps a .cmp-teaser with .cmp-teaser__content (title/description/action)
 * and .cmp-teaser__image (the slide image).
 */
export default function parse(element, { document }) {
  // Iterate the carousel slides. .cmp-carousel__item is a safe iteration key
  // (block-level div, not a nested interactive element) per structure.json.
  let slides = [...element.querySelectorAll('.cmp-carousel__item')];
  if (!slides.length) {
    // Fallback: some teaser markup omits the carousel item wrapper.
    slides = [...element.querySelectorAll('.teaser, .cmp-teaser--hero')];
  }

  const cells = [];

  slides.forEach((slide) => {
    // Image cell (first column).
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

    // Content cell (second column): heading + description + CTA.
    const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3');
    const description = slide.querySelector('.cmp-teaser__description, p');
    const ctas = [...slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a')];

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctas);

    // Skip slides that carry no content at all.
    if (!image && !contentCell.length) return;

    cells.push([image || '', contentCell]);
  });

  // Empty-block guard: nothing extracted.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
