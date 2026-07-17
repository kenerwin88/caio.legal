# caio.legal SEO Audit

Audit date: 2026-07-17  
Audit type: Full pre-launch technical, content, on-page, performance, schema, image, AI-search, and search-experience review  
Canonical target: `https://caio.legal/`

## Executive summary

**SEO readiness score: 51/100 — needs work before launch**

This is a pre-launch readiness score, not a confirmed live-site health score. The public domain could not be crawled because the apex currently has no A, AAAA, CNAME, or HTTPS record, while `www.caio.legal` returns NXDOMAIN. A search check also found no indexed result for the domain or exact brand phrase. Until DNS is restored, search engines and prospective visitors cannot reach the site.

The underlying site has a strong foundation: focused positioning, original writing, clear expertise signals, valid route-specific titles and descriptions, a clean six-URL sitemap, good rendered heading structure, excellent homepage accessibility, and stable layouts. The largest implementation gap is that the build's “prerender” step only writes route-specific metadata into an otherwise empty React shell. Each generated HTML page contains zero visible words, headings, links, or images until JavaScript executes. That weakens crawl resilience and makes the site much harder for non-JavaScript AI crawlers and extraction systems to understand.

Business type detected: **B2B professional services and expert publication**, focused on fractional AI leadership, governance, risk assessment, and adoption for law firms. The site does not currently present itself as a location-dependent local service, so a LocalBusiness/GBP program is not assumed.

### Score breakdown

| Category | Weight | Score | Weighted contribution |
|---|---:|---:|---:|
| Technical SEO | 22% | 20 | 4.4 |
| Content quality | 23% | 82 | 18.9 |
| On-page SEO | 20% | 62 | 12.4 |
| Schema / structured data | 10% | 0 | 0.0 |
| Performance / CWV | 10% | 85 | 8.5 |
| AI-search readiness | 10% | 38 | 3.8 |
| Images | 5% | 60 | 3.0 |
| **Overall** | **100%** |  | **51.0** |

### Top critical and high-priority issues

1. **Critical — the public domain is unreachable.** The apex has no public address/alias record and `www` does not exist in DNS.
2. **Critical — every generated HTML body is an empty JavaScript shell.** All six route files contain 0 HTML words, 0 headings, and 0 links before client rendering.
3. **High — invalid URLs return `200 OK` with the homepage shell.** This creates soft 404s and wastes crawl/index signals.
4. **High — no structured data exists.** The site is missing Organization/Person, Service, WebSite, BreadcrumbList, and Article JSON-LD.
5. **High — no dedicated, indexable service pages exist.** Search results for the relevant commercial intent favor focused pages such as “AI governance consulting for law firms,” while caio.legal keeps its services inside homepage sections.

### Top quick wins

1. Restore apex and `www` DNS, choose one canonical host, and force the other host to redirect.
2. Add `og:image`, `og:url`, `og:site_name`, and Twitter card metadata to all page templates.
3. Shorten the 90-character field-note title tag and sharpen the homepage title around “fractional CAIO for law firms.”
4. Add Ken Erwin as the visible article author, link to `/about`, and add published/modified dates.
5. Self-host/preload key fonts, convert the portrait to AVIF/WebP, and remove the remote image dependency.

## Scope and evidence

The audit reviewed:

- the full local project and production build;
- all six URLs declared in `public/sitemap.xml`;
- `robots.txt`, the sitemap, canonical tags, generated metadata, deployment configuration, and route behavior;
- Lighthouse lab runs on the homepage (mobile and desktop) and the longest article (mobile);
- current public DNS resolution and direct HTTP reachability;
- search-result checks for `site:caio.legal`, the exact brand phrase, and core service-intent phrases;
- external links and the remote portrait asset.

Limitations:

- The public site could not be crawled because DNS is not configured.
- Search Console, GA4, URL Inspection, and Moz/Bing backlink credentials are not configured.
- CrUX/PageSpeed field data is unavailable for an unreachable, apparently unindexed origin.
- The interactive visual browser connection failed in the audit environment. Rendered layout evidence therefore comes from Lighthouse, source inspection, and accessibility output rather than saved screenshots.
- Search-result absence is directional, not a substitute for Google Search Console index coverage.

## Crawl and indexability

### Public availability

| Check | Result |
|---|---|
| `caio.legal` A / AAAA / CNAME / HTTPS | No records returned |
| `www.caio.legal` | NXDOMAIN |
| Direct HTTPS fetch | DNS resolution failure |
| Exact-domain search check | No results found |
| Exact-brand phrase search check | No results found |

The Cloudflare tunnel configuration declares both hostnames, but the public DNS records that route those hostnames to the tunnel are absent. This is the immediate launch blocker.

### Robots and sitemap

`robots.txt` is concise and correct for a public site:

```text
User-agent: *
Allow: /

Sitemap: https://caio.legal/sitemap.xml
```

The XML sitemap is well formed and lists exactly six intended routes: the homepage, about page, and four field notes. No listed route is missing from the production build. Once article dates exist, add accurate `<lastmod>` values; do not fabricate change dates on every deployment.

### Soft 404s

The router falls back to `<Home />` for every unmatched pathname, and the server falls back to `/index.html`. Tested invalid routes such as `/definitely-not-a-page` and `/notes/not-a-real-note` return `200 OK` and the homepage canonical.

This should be replaced with:

- a real 404 page;
- an HTTP 404 response for unknown routes;
- direct 301 redirects only for genuine moved/normalized URLs;
- a single trailing-slash convention.

### JavaScript rendering dependency

The production build contains route-specific `<title>`, description, Open Graph type, and canonical values, but each document's `<body>` is only:

```html
<div id="root"></div>
<script type="module" src="/assets/..."></script>
```

All six generated HTML pages therefore have:

- 0 server-delivered words;
- 0 server-delivered H1/H2 headings;
- 0 server-delivered links;
- 0 server-delivered images;
- 0 JSON-LD blocks.

Google can render JavaScript, which explains the rendered Lighthouse SEO score of 100, but that score does not validate server-delivered content, indexing, topical depth, or AI-crawler extraction. Replace the metadata-only script with true static generation or server rendering that writes the rendered page body into each route's HTML.

## On-page SEO

### Titles and descriptions

| Route | Title length | Description length | Assessment |
|---|---:|---:|---|
| `/` | 40 | 65 | Clear but undersells the commercial query; consider “Fractional CAIO for Law Firms | caio.legal.” |
| `/about` | 28 | 142 | Good description; title could add “AI Leadership for Law Firms.” |
| `/notes/your-best-ai-work-is-probably-hidden` | 90 | 115 | Title is very likely to truncate; preserve the hook in the H1 and shorten the title tag. |
| `/notes/ai-policy-is-not-an-adoption-strategy` | 55 | 91 | Strong, clear title; description could add “law firms” for context. |
| `/notes/billable-hour-is-not-the-first-change` | 64 | 90 | Slightly long but usable; description is clear. |
| `/notes/what-a-fractional-ai-leader-owns` | 65 | 90 | Strong intent match; slightly long. |

Each route has a unique self-referencing canonical in the build. Rendered pages use one clear H1 and sensible H2/H3 hierarchy. Internal anchor text is descriptive.

### Missing social metadata

Every route is missing:

- `og:image` and image dimensions/alt;
- `og:url`;
- `og:site_name`;
- `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`.

Create one branded default 1200×630 image plus article-specific images where practical. This is primarily a sharing/CTR improvement, not a direct ranking factor.

### Internal linking

The homepage links to all four notes and `/about`, and the notes link back to briefings. The architecture is clean but shallow. Improvements:

- add contextual links between related notes;
- link each article byline to `/about`;
- add dedicated service pages and link them from relevant article passages;
- add breadcrumbs on articles and service pages;
- add a “related briefings” module to distribute authority and deepen sessions.

## Content quality and E-E-A-T

### Strengths

- Positioning is unusually clear: one accountable AI leader connecting governance, adoption, vendor decisions, professional duty, and daily work.
- The content is original and written from a consistent point of view rather than assembled as generic AI copy.
- The about page contains detailed first-hand experience, credentials, named projects, a visible role boundary, links to public work, and a direct explanation of relevance to law firms.
- The homepage has strong problem/solution alignment for managing partners and firm leaders.
- Each note addresses a discrete leadership question with a logical argument and useful operational framing.

### Gaps

- Articles are attributed to “caio.legal,” not a named person. Use “Ken Erwin,” link the byline, and provide an author/reviewer block.
- Articles have no published or updated dates. Add visible dates and matching structured data.
- Assertions about legal-industry adoption, professional obligations, and market behavior are not supported by citations. Add selective primary sources such as bar guidance, ethics opinions, and first-party industry research where factual claims are made.
- Four notes are a strong start but not yet a topical authority footprint.
- There are no case studies, anonymized engagement patterns, process examples, FAQ pages, or evidence-led outcome pages.
- The service offer is described well, but scope, deliverables, who it is for, process, and expected decision outcomes are scattered across the homepage rather than consolidated on intent-matched pages.

### Content architecture opportunity

Current search results for relevant intent favor pages explicitly titled around “AI governance consulting for law firms” and practical adoption frameworks. The site should build a small hub around three commercial pages:

1. `/fractional-caio-law-firms`
2. `/ai-governance-law-firms`
3. `/law-firm-ai-exposure-assessment`

Supporting editorial clusters:

- governance and policy: acceptable-use policy, vendor review, client confidentiality, supervision, incident response;
- adoption and change: pilots, training, practice-group rollout, measurement, internal champions;
- firm economics: billable-hour impacts, pricing, knowledge capture, talent development;
- executive leadership: CAIO role, decision rights, operating model, board/partner briefings.

Avoid creating thin pages for every minor keyword. Each service page should stand on its own with clear scope, decision outcomes, proof, FAQ content, and internal links to the strongest briefings.

## Structured data

No JSON-LD is present on any route.

Recommended implementation:

- homepage: `WebSite` plus `Organization` or `ProfessionalService` only where the facts are accurate;
- about page: `Person` connected to the organization/site using stable `@id` values and `sameAs` links;
- service pages: `Service` with provider, audience, area served only if factually defined, and clear page URLs;
- articles: `Article` or `BlogPosting` with headline, description, author, datePublished, dateModified, mainEntityOfPage, image, and publisher;
- articles/service pages: `BreadcrumbList`;
- FAQ schema only when the same FAQs are visibly rendered and eligible under Google's current rich-result rules.

Do not add `LegalService` merely because the audience is law firms: the about page explicitly states that Ken is not a lawyer and does not provide legal advice. `ProfessionalService` or `Organization` is the safer factual model unless the business structure supports something more specific.

## Performance and Core Web Vitals

### Lighthouse lab results

| Page / mode | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Homepage / mobile | 82 | 100 | 100 | 100 | 3.4s | 3.7s | 0ms | 0 |
| Long article / mobile | 85 | 94 | 100 | 100 | 3.3s | 3.3s | 0ms | 0 |
| Homepage / desktop | 97 | 100 | 100 | 100 | 1.0s | 1.0s | 0ms | 0.008 |

These are lab measurements against the local production build, not CrUX field data.

### Main performance findings

- The mobile LCP is text, not an image. The delay is driven mainly by render-blocking CSS/font work and the intentional hero reveal timing.
- The CSS `@import` creates a critical request chain through Google Fonts. Lighthouse estimated roughly 2.3 seconds of mobile render-blocking opportunity.
- Google Fonts transferred about 174 KB across three font files on the homepage.
- The home route downloads the 102 KB remote portrait even though it is below the fold.
- The production JS bundle is 231 KB raw / about 72 KB transferred; Lighthouse estimated 34–41 KB of unused JavaScript depending on route.
- Layout stability and main-thread blocking are excellent: 0ms TBT and essentially zero CLS.

Recommended order:

1. Produce real static HTML so the initial content does not depend on React startup.
2. Self-host/subset fonts or reduce the number of families/weights; preload only the critical font.
3. Replace CSS `@import` with explicit preload/stylesheet tags if Google-hosted fonts remain.
4. Do not delay LCP text with entrance animation; respect reduced motion and make the initial H1 visible immediately.
5. Lazy-load the below-fold homepage portrait and use `fetchpriority="high"` only where the portrait is truly above the fold.
6. Code-split route content or use a static-site generator so articles do not download homepage-only code.

## Images

Strengths:

- The portrait has meaningful `alt="Ken Erwin"` text.
- Explicit width and height attributes reduce layout shift.
- The favicon is lightweight SVG.

Issues:

- The portrait is served from `devopslibrary.com`, creating an avoidable availability, privacy, cache-control, and performance dependency.
- The JPEG is roughly 102 KB and Lighthouse estimates about 54 KB savings from a next-generation format.
- The same image is used in different aspect-ratio treatments without route-specific source sizing.
- No social-sharing images exist.

Host an optimized AVIF/WebP version on caio.legal, provide `srcset`/`sizes`, keep the explicit dimensions, lazy-load below-fold usage, and create purpose-built social images.

## AI-search readiness / GEO

The prose itself is strong for AI retrieval: it uses clear headings, defines CAIO, names risks, and presents compact operational frameworks. However, machine extraction is held back by implementation and provenance gaps.

Priority improvements:

- deliver article and service content in the initial HTML;
- add named authorship, dates, credentials, and links to first-party evidence;
- add Organization/Person/Article/Service structured data with stable entity IDs;
- add concise definition and answer blocks near the top of key pages;
- add an optional `llms.txt` that points to the canonical homepage, about page, services, and briefing index;
- publish a human-readable briefing index page instead of relying only on a homepage anchor;
- avoid unsupported superlatives and keep experience claims connected to the disclosure already present on `/about`.

`llms.txt` is supplemental. It does not replace crawlable HTML, normal internal linking, sitemaps, or structured data.

## Search experience (SXO)

The homepage is persuasive for a referred visitor but does not fully match a cold commercial searcher's next questions. Searchers looking for a fractional CAIO or AI governance consultant typically need to know:

- whether the service is specifically for their firm size and maturity;
- what the first engagement includes;
- what artifacts or decisions they will leave with;
- how governance and adoption work together;
- what is explicitly outside scope;
- why this advisor is credible and how to begin.

The site answers most of these somewhere, but not in a dedicated, scannable service page. Build those pages before expanding the blog aggressively.

## Security and deployment notes

The Nginx configuration includes `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a restrictive `Permissions-Policy`. Static assets receive immutable caching. Positive items that remain unverified live include TLS, compression, the actual redirect chain, cache headers, and response codes.

Consider adding HSTS after HTTPS and host redirects are confirmed. A Content Security Policy would improve defense in depth but should be deployed carefully because the current Google Fonts and remote portrait dependencies need to be accounted for.

## Measurement and authority limitations

- No Search Console or GA4 credentials were available, so clicks, impressions, CTR, query mix, organic landing pages, and confirmed index status were not audited.
- No Moz or Bing Webmaster API credentials were available. Backlink quality and referring-domain counts are unknown.
- No prior drift baseline exists.
- There is no CrUX field record available to validate real-user Core Web Vitals.

Set up Search Console and submit the sitemap immediately after DNS and HTTPS are live. Record the first technical/drift baseline only after the canonical site is reachable.

## Recommended launch gate

Do not treat the site as SEO-ready until all of the following are true:

- apex DNS resolves and HTTPS returns 200;
- `www` redirects permanently to the chosen canonical host;
- all six intended pages return rendered HTML with visible content before JavaScript;
- unknown URLs return a real 404;
- canonicals, robots, and sitemap are reachable on the live origin;
- Organization/Person and Article structured data validate;
- social images and article authorship/dates are present;
- mobile LCP is retested after font/render changes;
- Search Console property and sitemap submission are complete.

