/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document: document2 }) {
    let slides = [...element.querySelectorAll(".cmp-carousel__item")];
    if (!slides.length) {
      slides = [...element.querySelectorAll(".teaser, .cmp-teaser--hero")];
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
      const heading = slide.querySelector(".cmp-teaser__title, h1, h2, h3");
      const description = slide.querySelector(".cmp-teaser__description, p");
      const ctas = [...slide.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a")];
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      contentCell.push(...ctas);
      if (!image && !contentCell.length) return;
      cells.push([image || "", contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    const description = element.querySelector(".cmp-teaser__description, p:not(.cmp-teaser__pretitle)");
    const ctas = [...element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a")];
    const textCell = [];
    if (pretitle) textCell.push(pretitle);
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    textCell.push(...ctas);
    if (!image && !textCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", textCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document: document2 }) {
    const items = [...element.querySelectorAll("li.cmp-image-list__item, .cmp-image-list__item")];
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector(".cmp-image-list__item-image img, .cmp-image__image, img");
      const titleLink = item.querySelector(".cmp-image-list__item-title-link");
      const titleSpan = item.querySelector(".cmp-image-list__item-title");
      const description = item.querySelector(".cmp-image-list__item-description");
      const bodyCell = [];
      if (titleLink || titleSpan) {
        const titleText = (titleSpan || titleLink).textContent.trim();
        const href = titleLink && titleLink.getAttribute("href");
        const heading = document2.createElement("h3");
        if (href) {
          const link = document2.createElement("a");
          link.setAttribute("href", href);
          link.textContent = titleText;
          heading.append(link);
        } else {
          heading.textContent = titleText;
        }
        bodyCell.push(heading);
      }
      if (description) bodyCell.push(description);
      if (!image && !bodyCell.length) return;
      cells.push([image || "", bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse4(element, { document: document2 }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image__image, img");
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    const description = element.querySelector(".cmp-teaser__description, p");
    const ctas = [...element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a")];
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctas);
    if (!image && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([image]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header",
        "footer.cmp-experiencefragment--footer",
        "#destination_publishing_iframe_wkndsite_0",
        "#toggleNav",
        "#mobileNav",
        "iframe",
        "meta"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Landing page: hero carousel, featured-article band, and card grids of articles and adventures",
    urls: ["https://wknd.site/us/en.html"],
    blocks: [
      { name: "carousel-hero", instances: [".carousel.cmp-carousel--hero"] },
      { name: "columns-featured", instances: [".teaser.cmp-teaser--featured"] },
      { name: "cards-article", instances: [".image-list.list"] },
      { name: "hero-promo", instances: [".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"] }
    ],
    sections: [
      { id: "rc1", name: "Hero carousel", selector: [".carousel.cmp-carousel--hero"], style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "rc2", name: "Featured article band", selector: [".teaser.cmp-teaser--featured"], style: "grey", blocks: ["columns-featured"], defaultContent: [] },
      { id: "rc3", name: "Recent articles", selector: ["main.cmp-layout-container--fixed:nth-of-type(1) .image-list.list"], style: null, blocks: ["cards-article"], defaultContent: [".title.cmp-title--underline"] },
      { id: "rc4", name: "Next adventures heading", selector: [".title.cmp-title--underline"], style: null, blocks: [], defaultContent: [".title.cmp-title--underline"] },
      { id: "rc5", name: "Climbing New Zealand promo", selector: [".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"], style: null, blocks: ["hero-promo"], defaultContent: [] },
      { id: "rc6", name: "Where do you want to go", selector: ["main.cmp-layout-container--fixed:nth-of-type(2) .image-list.list"], style: null, blocks: ["cards-article"], defaultContent: [".title.cmp-title--underline"] }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "columns-featured": parse2,
    "cards-article": parse3,
    "hero-promo": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
