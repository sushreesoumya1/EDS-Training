/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIntroParser from './parsers/hero-intro.js';
import columnsArticleHeaderParser from './parsers/columns-article-header.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroOverlayParser from './parsers/hero-overlay.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'about-us',
  description: 'About Us / brand story page: intro banner, case-study header, image gallery, testimonial tabs, latest-articles cards, FAQ accordion and a closing call-to-action hero.',
  urls: [
    'https://wknd-trendsetters.site/about-us'
  ],
  blocks: [
    {
      name: 'hero-intro',
      instances: ['header.section.secondary-section .grid-layout.grid-gap-xxl']
    },
    {
      name: 'columns-article-header',
      instances: ['.grid-layout.grid-gap-lg']
    },
    {
      name: 'cards-gallery',
      instances: ['.grid-layout.desktop-4-column.grid-gap-sm']
    },
    {
      name: 'tabs-testimonial',
      instances: ['.tabs-wrapper']
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-4-column.grid-gap-md']
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list']
    },
    {
      name: 'hero-overlay',
      instances: ['section.inverse-section .utility-radius-card.utility-overflow-clip']
    }
  ],
  sections: [
    {
      id: 'rc1',
      name: 'Intro banner',
      selector: ['#main-content > header.section.secondary-section'],
      style: 'grey',
      blocks: ['hero-intro'],
      defaultContent: []
    },
    {
      id: 'rc2',
      name: 'Case-study header',
      selector: ['#main-content > section.section:nth-of-type(1)'],
      style: null,
      blocks: ['columns-article-header'],
      defaultContent: []
    },
    {
      id: 'rc3',
      name: 'Style in every snapshot gallery',
      selector: ['#main-content > section.section.secondary-section:nth-of-type(2)'],
      style: 'grey',
      blocks: ['cards-gallery'],
      defaultContent: ['.utility-text-align-center.utility-margin-bottom-8rem']
    },
    {
      id: 'rc4',
      name: 'Testimonial tabs',
      selector: ['#main-content > section.section:nth-of-type(3)'],
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: []
    },
    {
      id: 'rc5',
      name: 'Latest articles',
      selector: ['#main-content > section.section.secondary-section:nth-of-type(4)'],
      style: 'grey',
      blocks: ['cards-article'],
      defaultContent: ['.utility-text-align-center']
    },
    {
      id: 'rc6',
      name: 'FAQ',
      selector: ['#main-content > section.section:nth-of-type(5)'],
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['.grid-layout.grid-gap-xxl > div:first-child']
    },
    {
      id: 'rc7',
      name: 'Closing call-to-action',
      selector: ['#main-content > section.section.inverse-section'],
      style: null,
      blocks: ['hero-overlay'],
      defaultContent: []
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero-intro': heroIntroParser,
  'columns-article-header': columnsArticleHeaderParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-overlay': heroOverlayParser,
};

// TRANSFORMER REGISTRY
// Section transformer runs after cleanup, and only when the template has 2+ sections.
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
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
