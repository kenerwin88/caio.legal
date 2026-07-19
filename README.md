# caio.legal

A point-of-view site and field-note publication for AI leadership in law firms.

## Run locally

```sh
npm install
npm run dev
```

## Production build

```sh
npm run check
```

The check runs linting and type checking, then creates and verifies fully rendered static HTML for the homepage, about page, briefings, articles, and custom 404 page in `dist/`. JavaScript hydrates the rendered pages for interactive behavior.

## Deployment

Production hosting is Cloudflare Pages.

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 22
- Production domain: `https://caio.legal`

`public/_headers` preserves the site's security headers and immutable asset caching. `public/_redirects` normalizes trailing slashes. Cloudflare serves the generated top-level `404.html` for unknown routes.

Every production change should pass the full quality gate before deployment:

```sh
npm run check
```

## Content

Page components live in `src/app.tsx`, shared article and metadata content lives in `src/site-data.ts`, and the browser entry point lives in `src/main.tsx`. Design tokens and responsive styles live in `src/styles.css`.
