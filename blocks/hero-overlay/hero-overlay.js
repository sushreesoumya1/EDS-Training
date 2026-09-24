/**
 * loads and decorates the hero-overlay block
 * A full-bleed background image with a dark overlay and overlaid heading,
 * text and CTA.
 * @param {Element} block The hero-overlay block element
 */
export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }
}
