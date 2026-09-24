/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * NOTE: the hero-intro block is authored as <header class="section secondary-section">
 * INSIDE #main-content, so a bare `header` selector must NOT be used — it would
 * remove authorable content. Site navigation is `div.navbar`, not a <header>.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Non-authorable site chrome that could interfere with block matching.
    // Found in cleaned.html: <a href="#main-content" class="skip-link">, <div class="navbar">
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable content: site footer and in-article breadcrumbs.
    // Found in cleaned.html: <footer class="footer inverse-footer">,
    // <div class="breadcrumbs"> (nav chrome inside the case-study header block).
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      '.breadcrumbs',
    ]);

    // Strip Astro build attributes left on markup (found in cleaned.html: data-astro-cid-*).
    element.querySelectorAll('[data-astro-cid-37fxchfa], [data-astro-cid-rbygaycu]').forEach((el) => {
      el.removeAttribute('data-astro-cid-37fxchfa');
      el.removeAttribute('data-astro-cid-rbygaycu');
    });
  }
}
