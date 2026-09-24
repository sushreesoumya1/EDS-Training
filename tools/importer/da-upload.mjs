#!/usr/bin/env node
/*
 * DA upload helper — wraps each content/*.plain.html fragment into a full
 * Document Authoring HTML document and POSTs it to the DA source API.
 *
 * Credentials are injected by the harness (no Authorization header) when the
 * "Allow LLM to use my Adobe credentials for Document Authoring uploads"
 * opt-in is enabled. On 401/403, enable that opt-in and re-run.
 *
 * Usage: node tools/importer/da-upload.mjs [--dry-run]
 *   ORG/REPO are read from .migration/project.json contentHostUrl.
 */
import fs from 'node:fs';
import path from 'node:path';

const DRY = process.argv.includes('--dry-run');
const ORG = 'sushreesoumya1';
const REPO = 'eds-training';
const CONTENT_DIR = 'content';

// Fragments served at site root (nav/footer) vs pages.
const ROOT_FRAGMENTS = new Set(['nav', 'footer']);

function wrapDocument(fragmentHtml) {
  // DA/EDS document shape: <body><header></header><main>…</main><footer></footer></body>
  return `<body>
  <header></header>
  <main>${fragmentHtml}</main>
  <footer></footer>
</body>
`;
}

function collectPlainHtml(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectPlainHtml(full, acc);
    else if (entry.name.endsWith('.plain.html')) acc.push(full);
  }
  return acc;
}

async function uploadOne(file) {
  const rel = path.relative(CONTENT_DIR, file).replace(/\.plain\.html$/, '');
  // us/en scope + root fragments only; skip boilerplate leftovers.
  const isRootFragment = ROOT_FRAGMENTS.has(rel);
  const isUsEn = rel === 'us/en' || rel.startsWith('us/en/');
  if (!isRootFragment && !isUsEn) return { rel, status: 'skipped' };

  const fragment = fs.readFileSync(file, 'utf8');
  const doc = wrapDocument(fragment);
  const daPath = `${rel}.html`;
  const url = `https://admin.da.live/source/${ORG}/${REPO}/${daPath}`;

  if (DRY) return { rel, status: 'dry-run', url };

  const form = new FormData();
  form.append('data', new Blob([doc], { type: 'text/html' }), path.basename(daPath));
  const resp = await fetch(url, { method: 'POST', body: form });
  return { rel, status: resp.ok ? 'ok' : `HTTP ${resp.status}`, url };
}

const files = collectPlainHtml(CONTENT_DIR);
const results = [];
for (const f of files) {
  // eslint-disable-next-line no-await-in-loop
  results.push(await uploadOne(f));
}
const ok = results.filter((r) => r.status === 'ok' || r.status === 'dry-run');
const skipped = results.filter((r) => r.status === 'skipped');
const failed = results.filter((r) => !['ok', 'dry-run', 'skipped'].includes(r.status));
results.filter((r) => r.status !== 'skipped').forEach((r) => console.log(`${r.status.padEnd(10)} ${r.rel}`));
console.log(`\n${ok.length} uploaded/ready, ${skipped.length} skipped (out of scope), ${failed.length} failed`);
if (failed.length) { console.log('Failures:', failed.map((f) => `${f.rel} (${f.status})`).join(', ')); process.exit(1); }
