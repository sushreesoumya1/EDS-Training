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

  // tools/importer/import-article-detail.js
  var import_article_detail_exports = {};
  __export(import_article_detail_exports, {
    default: () => import_article_detail_default
  });

  // tools/importer/parsers/cards-related.js
  function parse(element, { document: document2 }) {
    const items = [...element.querySelectorAll("li.cmp-list__item, .cmp-list__item")];
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a.cmp-list__item-link, a");
      const titleEl = item.querySelector(".cmp-list__item-title");
      const dateEl = item.querySelector(".cmp-list__item-date");
      const titleText = (titleEl || link || item).textContent.trim();
      const href = link && link.getAttribute("href");
      const dateText = dateEl ? dateEl.textContent.trim() : "";
      if (!titleText && !dateText) return;
      const bodyCell = [];
      if (titleText) {
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          bodyCell.push(a);
        } else {
          bodyCell.push(titleText);
        }
      }
      if (dateText) {
        const p = document2.createElement("p");
        p.textContent = dateText;
        bodyCell.push(p);
      }
      cells.push([bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-related", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-author.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector(".cmp-byline__image img, .cmp-image__image, img");
    const name = element.querySelector(".cmp-byline__name, h1, h2, h3");
    const role = element.querySelector(".cmp-byline__occupations, p");
    const textCell = [];
    if (name) textCell.push(name);
    if (role) textCell.push(role);
    if (!image && !textCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", textCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-author", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-contentfragment__title"
      ]);
    }
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

  // tools/importer/import-article-detail.js
  var PAGE_TEMPLATE = {
    name: "article-detail",
    description: "Editorial article: hero image, byline, long-form body, related-links sidebar",
    urls: [
      "https://wknd.site/us/en/magazine/arctic-surfing.html",
      "https://wknd.site/us/en/magazine/guide-la-skateparks.html",
      "https://wknd.site/us/en/magazine/san-diego-surf.html",
      "https://wknd.site/us/en/magazine/ski-touring.html",
      "https://wknd.site/us/en/magazine/western-australia.html"
    ],
    blocks: [
      { name: "cards-related", instances: ["aside.cmp-layoutcontainer--sidebar .cmp-list", "aside .list .cmp-list"] },
      { name: "columns-author", instances: ["div.byline.image", ".cmp-byline"] }
    ],
    sections: [
      { id: "s1", name: "Article header + body", selector: ["main.cmp-layout-container--fixed"], style: null, blocks: [], defaultContent: [".cmp-breadcrumb", ".cmp-contentfragment__title", ".cmp-contentfragment__elements"] },
      { id: "s2", name: "Article body content", selector: ["div.cmp-contentfragment__elements"], style: null, blocks: [], defaultContent: [".cmp-contentfragment__element"] },
      { id: "s3", name: "Share + related sidebar", selector: ["aside.cmp-layoutcontainer--sidebar"], style: null, blocks: ["cards-related"], defaultContent: [] },
      { id: "s4", name: "Author bio", selector: ["div.byline.image"], style: null, blocks: ["columns-author"], defaultContent: [] }
    ]
  };
  var parsers = {
    "cards-related": parse,
    "columns-author": parse2
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
        document2.querySelectorAll(selector).forEach((element) => {
          if (!pageBlocks.some((b) => b.element === element)) {
            pageBlocks.push({ name: blockDef.name, selector, element });
          }
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_article_detail_default = {
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
  return __toCommonJS(import_article_detail_exports);
})();
