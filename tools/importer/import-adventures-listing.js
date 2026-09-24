/* eslint-disable */
/* global WebImporter */

import heroPromoParser from './parsers/hero-promo.js';
import cardsArticleParser from './parsers/cards-article.js';

import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const PAGE_TEMPLATE = {
  name: 'adventures-listing',
  description: 'Section landing: page title, hero with overlay intro, and a filterable grid of cards',
  urls: [],
  blocks: [
    { name: 'hero-promo', instances: ['.teaser.cmp-teaser--hero'] },
    { name: 'cards-article', instances: ['.image-list.list'] },
  ],
  sections: [
    { id: 'rc1', name: 'Page title', selector: ['.title.cmp-title--underline'], style: null, blocks: [], defaultContent: ['.title.cmp-title--underline'] },
    { id: 'rc2', name: 'Hero intro', selector: ['.teaser.cmp-teaser--hero'], style: null, blocks: ['hero-promo'], defaultContent: [] },
    { id: 'rc3', name: 'Current adventures grid', selector: ['.image-list.list'], style: null, blocks: ['cards-article'], defaultContent: ['.title.cmp-title--underline'] },
  ],
};

const parsers = {
  'hero-promo': heroPromoParser,
  'cards-article': cardsArticleParser,
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (!pageBlocks.some((b) => b.element === element)) {
          pageBlocks.push({ name: blockDef.name, selector, element });
        }
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
