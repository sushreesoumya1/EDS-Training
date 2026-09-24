# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Dynamic listings (magazine / adventures)

The magazine and adventures listings, plus the homepage rails, are driven by a
query index (`helix-query.yaml` → `/us/en/query-index.json`). A `cards-article`
block authored with just a folder path (e.g. `/us/en/magazine`) fetches the
index and renders a card per published page, so new articles appear with no
code or content change.

### Known caveat: index propagation lag

When you **publish** (or **unpublish**) an article, it may take a second
publish/unpublish action — or a short wait — before it appears on / disappears
from the listings. This is standard AEM Edge Delivery behaviour, not a bug in
the listing block:

1. Publishing a page triggers an **asynchronous** rebuild of
   `query-index.json`; that job can finish *after* the publish action returns,
   so the very first publish may not yet be reflected in the index.
2. The live `query-index.json` is CDN-cached (`cache-control: max-age=7200`),
   so a freshly rebuilt index can still be served stale for a while.

The second publish/unpublish (or simply waiting a few minutes and refreshing)
lets the index rebuild and the cache roll over, after which the change shows.

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
