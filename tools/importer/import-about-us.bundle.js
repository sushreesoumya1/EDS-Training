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

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector('h1, h2, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, p, [class*="subheading"]');
    const ctaLinks = Array.from(
      element.querySelectorAll(".button-group a, a.button")
    );
    const images = Array.from(
      element.querySelectorAll("img.cover-image, img")
    );
    if (!heading && !subheading && !images.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (images.length) {
      cells.push([images]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article-header.js
  function parse2(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length < 2) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCol = columns[0];
    const rightCol = columns[1];
    const cells = [];
    cells.push([
      [...leftCol.childNodes],
      [...rightCol.childNodes]
    ]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article-header", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document: document2 }) {
    const cards = Array.from(element.querySelectorAll(":scope > div"));
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const text = Array.from(card.children).filter((el) => el.tagName !== "IMG" && !el.querySelector("img"));
      const contentCell = [];
      if (text.length) contentCell.push(...text);
      cells.push([img || "", contentCell.length ? contentCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document: document2 }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content > .tab-pane"));
    const menuButtons = Array.from(element.querySelectorAll(".tab-menu button.tab-menu-link, .tab-menu-link"));
    if (!panes.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panes.forEach((pane, i) => {
      const button = menuButtons[i];
      const labelCell = button ? Array.from(button.childNodes) : [`Tab ${i + 1}`];
      const contentCell = Array.from(pane.childNodes);
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    let items = Array.from(element.querySelectorAll(":scope > a .article-card-body")).map((body) => {
      var _a, _b;
      return {
        body,
        image: (_a = body.parentElement) == null ? void 0 : _a.querySelector(".article-card-image"),
        href: (_b = body.closest("a")) == null ? void 0 : _b.getAttribute("href")
      };
    });
    if (!items.length) {
      items = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link")).map((card) => ({
        body: card.querySelector(".article-card-body"),
        image: card.querySelector(".article-card-image"),
        href: card.getAttribute("href")
      }));
    }
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach(({ body, image, href }) => {
      const imageCell = image ? image.querySelector("img") || image : "";
      const contentCell = [];
      if (body) {
        const meta = body.querySelector(".article-card-meta");
        if (meta) contentCell.push(meta);
        const heading = body.querySelector("h1, h2, h3, h4, h5, h6");
        if (heading) {
          if (href) {
            const link = document2.createElement("a");
            link.setAttribute("href", href);
            link.textContent = heading.textContent.trim();
            heading.textContent = "";
            heading.append(link);
          }
          contentCell.push(heading);
        }
      }
      cells.push([imageCell, contentCell.length ? contentCell : ""]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope details.faq-item"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      const answer = item.querySelector(".faq-answer");
      let titleCell = "";
      if (summary) {
        const questionText = summary.querySelector("span");
        if (questionText) {
          titleCell = questionText;
        } else {
          const clone = summary.cloneNode(true);
          clone.querySelectorAll("svg").forEach((svg) => svg.remove());
          titleCell = clone.textContent.trim();
        }
      }
      const contentCell = answer ? Array.from(answer.childNodes) : "";
      cells.push([titleCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document: document2 }) {
    const bgImage = element.querySelector("img.cover-image, img");
    const body = element.querySelector(".card-body") || element;
    const heading = body.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = body.querySelector('p.subheading, p, [class*="subheading"]');
    const ctaLinks = Array.from(body.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "footer.footer",
        ".breadcrumbs"
      ]);
      element.querySelectorAll("[data-astro-cid-37fxchfa], [data-astro-cid-rbygaycu]").forEach((el) => {
        el.removeAttribute("data-astro-cid-37fxchfa");
        el.removeAttribute("data-astro-cid-rbygaycu");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
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

  // tools/importer/import-about-us.js
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: "About Us / brand story page: intro banner, case-study header, image gallery, testimonial tabs, latest-articles cards, FAQ accordion and a closing call-to-action hero.",
    urls: [
      "https://wknd-trendsetters.site/about-us"
    ],
    blocks: [
      {
        name: "hero-intro",
        instances: ["header.section.secondary-section .grid-layout.grid-gap-xxl"]
      },
      {
        name: "columns-article-header",
        instances: [".grid-layout.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: [".grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: [".grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-overlay",
        instances: ["section.inverse-section .utility-radius-card.utility-overflow-clip"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "Intro banner",
        selector: ["#main-content > header.section.secondary-section"],
        style: "grey",
        blocks: ["hero-intro"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "Case-study header",
        selector: ["#main-content > section.section:nth-of-type(1)"],
        style: null,
        blocks: ["columns-article-header"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Style in every snapshot gallery",
        selector: ["#main-content > section.section.secondary-section:nth-of-type(2)"],
        style: "grey",
        blocks: ["cards-gallery"],
        defaultContent: [".utility-text-align-center.utility-margin-bottom-8rem"]
      },
      {
        id: "rc4",
        name: "Testimonial tabs",
        selector: ["#main-content > section.section:nth-of-type(3)"],
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "Latest articles",
        selector: ["#main-content > section.section.secondary-section:nth-of-type(4)"],
        style: "grey",
        blocks: ["cards-article"],
        defaultContent: [".utility-text-align-center"]
      },
      {
        id: "rc6",
        name: "FAQ",
        selector: ["#main-content > section.section:nth-of-type(5)"],
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [".grid-layout.grid-gap-xxl > div:first-child"]
      },
      {
        id: "rc7",
        name: "Closing call-to-action",
        selector: ["#main-content > section.section.inverse-section"],
        style: null,
        blocks: ["hero-overlay"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "columns-article-header": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
  var import_about_us_default = {
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
  return __toCommonJS(import_about_us_exports);
})();
