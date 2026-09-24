/* eslint-disable */
/* global WebImporter */

import carouselHeroParser from './parsers/carousel-hero.js';
import columnsSpecsParser from './parsers/columns-specs.js';
import tabsContentParser from './parsers/tabs-content.js';

import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const PAGE_TEMPLATE = {
  name: 'adventure-detail',
  description: 'Detail page: full-width hero carousel, left metadata sidebar, and tabbed body content',
  urls: [],
  blocks: [
    { name: 'carousel-hero', instances: ['.carousel.cmp-carousel--mini'] },
    { name: 'columns-specs', instances: ['dl.cmp-contentfragment__elements'] },
    { name: 'tabs-content', instances: ['.cmp-tabs'] },
  ],
  sections: [
    { id: 's1', name: 'Breadcrumb', selector: ['div.breadcrumb.cmp-breadcrumb--fixed'], style: null, blocks: [], defaultContent: ['.cmp-breadcrumb'] },
    { id: 's2', name: 'Hero carousel', selector: ['.carousel.cmp-carousel--mini'], style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 's3', name: 'Adventure body', selector: ['main.cmp-layout-container--fixed'], style: null, blocks: ['columns-specs', 'tabs-content'], defaultContent: ['.cmp-title', 'h1'] },
  ],
};

const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-specs': columnsSpecsParser,
  'tabs-content': tabsContentParser,
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
