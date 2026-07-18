# caio.legal SEO Action Plan

Audit date: 2026-07-17

Current SEO health score: **72/100**

## Phase 1 implementation status — complete locally

Completed on 2026-07-17 and verified in the production build:

- connected `WebSite`, `ProfessionalService`, `Person`, `ProfilePage`, `BlogPosting`, `BreadcrumbList`, and visible-service `Service` JSON-LD using stable `@id` references;
- named Ken Erwin bylines, linked author profile, Git-backed publication/modification dates, author credentials, and official ABA/NIST sources on every briefing;
- improved route titles and descriptions plus complete Open Graph and Twitter card metadata with a branded 1200×630 image;
- self-hosted fonts and portrait, responsive AVIF/WebP portrait sources, no-JavaScript-safe reveal behavior, and larger coarse-pointer hit areas;
- HSTS, a locally exercised Content-Security-Policy, immutable font/image caching, and accurate sitemap `<lastmod>` values;
- an expanded build verifier covering initial HTML, canonical URLs, metadata, schema, provenance, local assets, 404 behavior, security headers, and sitemap dates.

The live score remains the pre-implementation audit baseline until these changes are deployed and recrawled. The only Phase 1 host item outside this repository is the `www.caio.legal` redirect: Cloudflare requires an account-level Bulk Redirect plus a proxied DNS record. That setting has not been changed or deployed.

## High priority — next 1–2 weeks

### 1. Implement connected structured data

Add a reusable JSON-LD graph using stable IDs:

- homepage: `WebSite`, `Organization` or `ProfessionalService`, and `Person`;
- About page: `ProfilePage` with Ken as `mainEntity`;
- briefings: `BlogPosting` plus `BreadcrumbList`;
- future commercial pages: `Service` plus `BreadcrumbList`.

Do not use `LegalService` unless the business is actually providing legal services. Keep the existing “not legal advice” boundary consistent in visible copy and schema.

**Acceptance:** every route passes Schema.org validation; entities connect through stable `@id` values; no placeholder or invented facts appear.

### 2. Add article provenance

- Change “Filed by caio.legal” to “By Ken Erwin.”
- Link the byline to `/about`.
- Add accurate publication and modification dates to the essay data model and visible article header.
- Add a concise author credential line.
- Cite primary sources for factual, ethics, security, or market claims.

**Acceptance:** each article visibly identifies its author and dates, and its BlogPosting schema matches the page.

### 3. Create intent-specific service pages

Recommended initial routes:

- `/fractional-caio-law-firms`
- `/ai-governance-law-firms`
- `/law-firm-ai-exposure-assessment`

Each page should state audience, problem, scope, process, deliverables, decision rights, boundaries, proof, expected next step, and a contact CTA. Link them from the homepage and relevant briefings.

**Acceptance:** each page has a unique search intent, 800+ words only where needed for complete coverage, a self-referencing canonical, Service schema, and at least three contextual internal links.

### 4. Establish search-engine ownership and discovery

- Verify `https://caio.legal/` in Google Search Console and Bing Webmaster Tools.
- Submit `https://caio.legal/sitemap.xml`.
- Inspect all six current canonical URLs.
- Request indexing only after schema and metadata updates are live.
- Record the first 28-day baseline for impressions, queries, indexed pages, and crawl errors.

**Acceptance:** both platforms verify the site; the sitemap is accepted; all intended pages are eligible for indexing.

### 5. Complete social metadata

- Create a branded 1200×630 default image.
- Add `og:image`, dimensions, alt, `og:url`, and `og:site_name`.
- Add Twitter `summary_large_image`, title, description, and image tags.
- Use article-specific images only when they add real context.

**Acceptance:** homepage, About, and article URLs render complete link previews in common social debuggers.

## Medium priority — next month

### 6. Strengthen the briefing library

Prioritize depth over volume:

1. Expand “What a fractional AI leader should own” into a comparison/evaluation resource.
2. Expand “Your AI policy is not an adoption strategy” with a governance-to-adoption operating model.
3. Expand “The billable hour…” with concrete examples and evidence.
4. Preserve the concise essay voice while adding frameworks, examples, and sources.

**Acceptance:** every briefing fully answers its target question and contains at least one concrete, independently useful framework or example.

### 7. Build internal topic pathways

- Create `/briefings` as a crawlable publication index.
- Add breadcrumbs to every briefing.
- Add two or three related briefings at the end of each article.
- Link articles to the service page that best matches their topic.
- Use descriptive anchor text rather than repeated generic CTAs.

**Acceptance:** every indexable page is reachable within three clicks; no briefing is an internal-link dead end.

### 8. Remove external performance dependencies

- Self-host and subset IBM Plex Sans, IBM Plex Mono, and Source Serif 4.
- Replace the CSS `@import` with local font declarations and selective preloads.
- Host Ken's portrait on caio.legal.
- Serve AVIF/WebP variants with an appropriate fallback.
- Keep explicit dimensions and descriptive alt text.

**Acceptance:** the initial render does not depend on Google Fonts or devopslibrary.com; lab LCP remains under 2.5s.

### 9. Make progressive enhancement robust

The `.reveal` class hides content until JavaScript adds `.is-visible`.

- Default critical content to visible.
- Apply hidden/animated states only after JavaScript establishes that animation is available.
- Preserve the existing reduced-motion behavior.

**Acceptance:** the full page remains visible and usable with JavaScript disabled.

### 10. Complete host and header hygiene

- Configure `www.caio.legal` and redirect once to the apex, or explicitly accept that it will not resolve.
- Add HSTS after verifying permanent HTTPS coverage.
- Add and test a Content-Security-Policy.
- Review whether `Access-Control-Allow-Origin: *` is necessary on HTML responses.

**Acceptance:** canonical host behavior is intentional, redirects are one hop, and the security policy does not break fonts, images, email links, or hydration.

### 11. Improve mobile touch targets

Increase vertical padding or hit-area size for:

- the brand link;
- inline/contact links that render below 48px high;
- the “See what is at stake” jump link.

**Acceptance:** primary mobile controls meet roughly 48×48px touch guidance without changing the visual hierarchy.

## Low priority / backlog

### 12. Improve snippets and titles

- Expand the homepage meta description to explain the audience and value proposition.
- Shorten the 90-character “best AI workflow” title tag while keeping the full H1.
- Test whether 64–65 character article titles truncate in target result layouts.

### 13. Add accurate sitemap modification dates

Generate `<lastmod>` from actual content modification dates, not build timestamps.

### 14. Add IndexNow if operationally useful

Use IndexNow for new or updated briefings after Bing Webmaster Tools is configured. Do not treat it as a Google indexing mechanism.

### 15. Add `llms.txt` after the site structure stabilizes

Include the homepage, About page, service pages, strongest briefings, and a concise description of the site's authority and scope. Treat this as optional AI-crawler guidance, not a ranking guarantee.

### 16. Improve off-site measurement

Configure free Bing Webmaster and/or Moz access so future audits can measure referring domains, anchors, and link quality. Do not disavow links without evidence of a manual action or a clearly harmful pattern.

## 90-day outcome targets

| Outcome | Target |
|---|---|
| Indexed canonical pages | 100% of intended pages |
| Search Console coverage errors | 0 unresolved critical errors |
| Dedicated commercial pages | 3 live and internally linked |
| Briefings with byline/date/schema | 100% |
| Valid structured data | 0 errors on all indexable pages |
| Field CWV | Good at the 75th percentile when data becomes available |
| Relevant referring domains | First 5–10 editorial/professional domains |
| Organic query baseline | Established and reviewed monthly |

## Recommended execution order

1. Search Console/Bing verification and baseline.
2. Article provenance plus schema foundation.
3. Social metadata and branded preview image.
4. Three service pages and internal linking.
5. Briefing expansion and evidence-led resources.
6. Fonts, portrait, progressive enhancement, headers, and touch polish.
7. Optional IndexNow and `llms.txt`.
