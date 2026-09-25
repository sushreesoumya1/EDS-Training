const INDEX_URL = '/us/en/query-index.json';
const DEFAULT_LIMIT = 4;

const normalize = (href) => new URL(href, window.location).pathname
  .replace(/\.html$/, '')
  .replace(/\/$/, '');

/**
 * Formats an index lastModified (unix seconds) like the authored dates,
 * e.g. "Thursday, 9 Jul 2020".
 */
function formatDate(seconds) {
  if (!Number(seconds)) return '';
  const date = new Date(Number(seconds) * 1000);
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const rest = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${weekday}, ${rest}`;
}

function buildItem(href, title, dateText) {
  const li = document.createElement('li');
  li.className = 'cards-related-item';
  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = href;
  a.textContent = title;
  p.append(a);
  li.append(p);
  if (dateText) {
    const date = document.createElement('p');
    date.textContent = dateText;
    li.append(date);
  }
  return li;
}

/**
 * Replaces the authored list with the newest published articles from the
 * current page's folder, so a newly published article appears here with no
 * edits to any other document. Authored dates are kept for known articles.
 */
async function decorateDynamic(ul, authoredDates, limit) {
  const current = normalize(window.location.pathname);
  const folder = current.substring(0, current.lastIndexOf('/') + 1);
  try {
    const resp = await fetch(INDEX_URL);
    if (!resp.ok) return;
    const { data = [] } = await resp.json();
    // newest first; ties (or a missing lastModified) fall back to reverse
    // index order, since newly published pages are appended to the index
    const entries = data
      .map((entry, position) => ({ entry, position }))
      .filter(({ entry: e }) => e.path && e.path.startsWith(folder) && e.path !== current)
      .sort((a, b) => (Number(b.entry.lastModified) || 0) - (Number(a.entry.lastModified) || 0)
        || b.position - a.position)
      .slice(0, limit)
      .map(({ entry }) => entry);
    if (!entries.length) return;
    ul.replaceChildren(...entries.map((e) => buildItem(
      e.path,
      e.title || e.path,
      authoredDates.get(e.path) || formatDate(e.lastModified),
    )));
  } catch {
    // keep the authored list if the index is unavailable
  }
}

/**
 * Related-articles list. Each row is a card with a linked title and a date.
 * Renders the authored rows immediately, then refreshes from the query index.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  const authoredDates = new Map();

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-related-item';
    const cell = row.firstElementChild;
    if (cell) {
      while (cell.firstChild) li.append(cell.firstChild);
    }
    const link = li.querySelector('a[href]');
    const paragraphs = li.querySelectorAll('p');
    if (link && paragraphs.length > 1) {
      authoredDates.set(normalize(link.href), paragraphs[paragraphs.length - 1].textContent.trim());
    }
    ul.append(li);
  });

  block.replaceChildren(ul);
  decorateDynamic(ul, authoredDates, Math.max(authoredDates.size, DEFAULT_LIMIT));
}
