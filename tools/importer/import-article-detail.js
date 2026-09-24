/* eslint-disable */
/* global WebImporter */

import cardsRelatedParser from './parsers/cards-related.js';
import columnsAuthorParser from './parsers/columns-author.js';

import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

const PAGE_TEMPLATE = {
  name: 'article-detail',
  description: 'Editorial article: hero image, byline, long-form body, related-links sidebar',
  urls: [
    'https://wknd.site/us/en/magazine/arctic-surfing.html',
    'https://wknd.site/us/en/magazine/guide-la-skateparks.html',
    'https://wknd.site/us/en/magazine/san-diego-surf.html',
    'https://wknd.site/us/en/magazine/ski-touring.html',
    'https://wknd.site/us/en/magazine/western-australia.html',
  ],
  blocks: [
    { name: 'cards-related', instances: ['aside.cmp-layoutcontainer--sidebar .cmp-list', 'aside .list .cmp-list'] },
    { name: 'columns-author', instances: ['div.byline.image', '.cmp-byline'] },
  ],
  sections: [
    { id: 's1', name: 'Article header + body', selector: ['main.cmp-layout-container--fixed'], style: null, blocks: [], defaultContent: ['.cmp-breadcrumb', '.cmp-contentfragment__title', '.cmp-contentfragment__elements'] },
    { id: 's2', name: 'Article body content', selector: ['div.cmp-contentfragment__elements'], style: null, blocks: [], defaultContent: ['.cmp-contentfragment__element'] },
    { id: 's3', name: 'Share + related sidebar', selector: ['aside.cmp-layoutcontainer--sidebar'], style: null, blocks: ['cards-related'], defaultContent: [] },
    { id: 's4', name: 'Author bio', selector: ['div.byline.image'], style: null, blocks: ['columns-author'], defaultContent: [] },
  ],
};

const parsers = {
  'cards-related': cardsRelatedParser,
  'columns-author': columnsAuthorParser,
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
