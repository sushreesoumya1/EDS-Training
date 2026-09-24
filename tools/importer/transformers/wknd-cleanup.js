/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 *
 * Removes non-authorable site chrome (global header/nav/search/language nav,
 * footer, mobile nav, tracking iframe) so the import contains only page-level
 * authorable content.
 *
 * All selectors verified against migration-work/cleaned.html:
 *  - header.cmp-experiencefragment--header        (line 5; wraps sign-in buttons,
 *      .languagenavigation, logo image, .cmp-navigation--header, .cmp-search--header)
 *  - footer.cmp-experiencefragment--footer        (line 471)
 *  - #destination_publishing_iframe_wkndsite_0    (line 566; Adobe demdex ID-sync iframe)
 *  - #toggleNav                                   (line 568; mobile nav toggle)
 *  - #mobileNav                                   (line 574; mobile navigation)
 *  - stray <meta> tags nested in cmp-image blocks (e.g. lines 183, 204, 227)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Content-fragment repeats the page title inside its body; the page already
    // has an authored <h1>, so drop the duplicate CF title before parsing.
    WebImporter.DOMUtils.remove(element, [
      '.cmp-contentfragment__title',
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (selectors from cleaned.html)
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
      '#destination_publishing_iframe_wkndsite_0',
      '#toggleNav',
      '#mobileNav',
      'iframe',
      'meta',
    ]);
  }
}
