import { createOptimizedPicture } from '../../scripts/aem.js';

const INDEX_URL = '/us/en/query-index.json';

/**
 * Detects a dynamic configuration: a block whose only content is a folder path
 * (e.g. "/us/en/magazine", optional "| 4" limit). Returns { path, limit } or null.
 */
function readDynamicConfig(block) {
  const rows = [...block.children];
  // dynamic config is a single row with no image and a path-like value
  if (rows.length > 3) return null;
  const link = block.querySelector('a[href]');
  const rawText = block.textContent.trim();
  const href = link ? new URL(link.href, window.location).pathname : rawText.split('|')[0].trim();
  if (!href || !href.startsWith('/') || block.querySelector('picture')) return null;
  const limitMatch = rawText.match(/\|\s*(\d+)/);
  return { path: href.replace(/\/$/, ''), limit: limitMatch ? Number(limitMatch[1]) : 0 };
}

/**
 * Builds a single article card <li> from an index entry.
 */
function cardFromEntry(entry) {
  const li = document.createElement('li');

  const imageCell = document.createElement('div');
  imageCell.className = 'cards-article-image';
  if (entry.image) {
    const a = document.createElement('a');
    a.href = entry.path;
    a.append(createOptimizedPicture(entry.image, entry.title || '', false, [{ width: '750' }]));
    imageCell.append(a);
  }

  const body = document.createElement('div');
  body.className = 'cards-article-body';
  const h3 = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = entry.path;
  titleLink.textContent = entry.title || entry.path;
  h3.append(titleLink);
  body.append(h3);
  if (entry.description) {
    const p = document.createElement('p');
    p.textContent = entry.description;
    body.append(p);
  }

  li.append(imageCell, body);
  return li;
}

/**
 * Fetches the query index and renders cards for every published page under
 * the configured folder — so new articles appear with no code/content change.
 */
async function decorateDynamic(block, config) {
  const ul = document.createElement('ul');
  block.replaceChildren(ul);
  try {
    const resp = await fetch(INDEX_URL);
    if (!resp.ok) return;
    const { data = [] } = await resp.json();
    const prefix = `${config.path}/`;
    let entries = data.filter((e) => e.path && e.path.startsWith(prefix));
    // newest first when a lastModified field is present
    entries.sort((a, b) => Number(b.lastModified || 0) - Number(a.lastModified || 0));
    if (config.limit) entries = entries.slice(0, config.limit);
    entries.forEach((entry) => ul.append(cardFromEntry(entry)));
  } catch {
    // leave the block empty on failure rather than break the page
  }
}

/**
 * Renders the authored (static) card rows.
 */
function decorateStatic(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-image';
      else div.className = 'cards-article-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const config = readDynamicConfig(block);
  if (config) {
    decorateDynamic(block, config);
  } else {
    decorateStatic(block);
  }
}
