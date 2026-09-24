/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND section breaks + section metadata.
 *
 * Driven by payload.template.sections (homepage: 6 sections). Selectors come
 * directly from tools/importer/page-templates.json (DOM-verified during page
 * analysis). Only section rc2 ("Featured article band") carries a style ("grey").
 *
 * Expected on the homepage: 5 <hr> section breaks (sections.length - 1) and
 * 1 Section Metadata block (the single styled section).
 *
 * Break insertion happens in beforeTransform, while every section element still
 * exists, because block parsers run between the hooks and replace the elements
 * many section selectors point at. A marker <hr> gives the styled section a
 * stable anchor for its metadata block in afterTransform.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is an array of candidate selectors — try each in order, first match wins.
function querySection(root, selectors) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no leading break
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // no selector matched on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have run; anchor each styled section's metadata block to whichever
    // element still exists: the marker <hr>, or the original section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
