import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Loads a page as a fragment document so we can read its metadata/hero.
 * @param {string} path
 * @returns {Document|null}
 */
async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(path);
    if (resp.ok) return new DOMParser().parseFromString(await resp.text(), 'text/html');
  }
  return null;
}

function metaFrom(doc, name) {
  const attr = name.includes(':') ? 'property' : 'name';
  const el = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return el ? el.getAttribute('content') : '';
}

/**
 * Detects the dynamic form: the block's only content is a link to an article
 * (no authored image). Returns the path or null.
 */
function readFeaturedLink(block) {
  if (block.querySelector('picture')) return null;
  const link = block.querySelector('a[href]');
  const path = link
    ? new URL(link.href, window.location).pathname
    : block.textContent.trim();
  return path && path.startsWith('/') ? path.replace(/\.html$/, '') : null;
}

/**
 * Renders the featured band from the authored (static) rows.
 */
function decorateStatic(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (col.querySelector('picture')) col.classList.add('columns-featured-image');
      else col.classList.add('columns-featured-content');
    });
  });
  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
  });
}

/**
 * Dynamic featured band: pulls the linked article's live title, description
 * and hero image so the block never goes stale when the article changes.
 */
async function decorateDynamic(block, path) {
  const doc = await loadFragment(path);
  if (!doc) { decorateStatic(block); return; }

  const image = document.createElement('div');
  image.className = 'columns-featured-image';
  const hero = doc.querySelector('main picture');
  if (hero) {
    const img = hero.querySelector('img');
    image.append(img
      ? createOptimizedPicture(img.src, metaFrom(doc, 'og:title'), false, [{ width: '1200' }])
      : hero);
  }

  const content = document.createElement('div');
  content.className = 'columns-featured-content';
  const eyebrow = document.createElement('p');
  eyebrow.textContent = 'Featured Article';
  const h2 = document.createElement('h2');
  h2.textContent = metaFrom(doc, 'og:title');
  const desc = document.createElement('p');
  desc.textContent = metaFrom(doc, 'og:description') || metaFrom(doc, 'description');
  const cta = document.createElement('p');
  const a = document.createElement('a');
  a.href = path;
  a.textContent = 'Read More';
  cta.append(a);
  content.append(eyebrow, h2, desc, cta);

  const wrapper = document.createElement('div');
  wrapper.append(image, content);
  block.replaceChildren(wrapper);
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const path = readFeaturedLink(block);
  if (path) {
    decorateDynamic(block, path);
  } else {
    decorateStatic(block);
  }
}
