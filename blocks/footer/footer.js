import { loadFragment } from '../fragment/fragment.js';
import { removeHtmlExtension } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer fragment (metadata-independent dual-fetch):
  // /content first (localhost / aem up), then site root (DA/EDS production)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  let fragment;
  if (resp.ok) {
    const html = await resp.text();
    fragment = document.createElement('div');
    fragment.innerHTML = html;
  } else {
    fragment = await loadFragment('/footer');
  }

  // normalize bare relative image paths (e.g. "images/logo.svg") to root-absolute.
  // Leave DA-processed paths ("./media_...") and already-absolute/external paths alone.
  fragment.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/') && !src.startsWith('./')) {
      img.setAttribute('src', `/${src}`);
    }
  });

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // label sections for styling
  const classes = ['footer-brand', 'footer-nav', 'footer-social', 'footer-legal'];
  classes.forEach((c, i) => {
    if (footer.children[i]) footer.children[i].classList.add(c);
  });

  // internal links use extensionless URLs on EDS
  removeHtmlExtension(footer);

  block.append(footer);
}
