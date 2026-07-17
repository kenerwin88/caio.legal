# caio.legal SEO Action Plan

Audit date: 2026-07-17

## Critical — complete before launch

### 1. Restore public DNS and canonical host routing

**Why:** Search engines and users cannot reach the domain. The apex has no address/alias records and `www` is NXDOMAIN.

**Work:**

- Route `caio.legal` to the configured Cloudflare tunnel.
- Add `www.caio.legal` and permanently redirect it to `https://caio.legal/`.
- Confirm HTTP → HTTPS and `www` → apex use one-hop 301/308 redirects.
- Verify the certificate covers both names.

**Acceptance:** `curl -I https://caio.legal/` returns 200, `https://www.caio.legal/` redirects once to the apex, and DNS resolves from public resolvers.

### 2. Replace metadata-only “prerendering” with true static HTML

**Why:** All six generated pages contain zero visible HTML words or headings until JavaScript runs.

**Work:**

- Adopt a static-generation/SSR path that renders the homepage, about page, and each article into its route HTML.
- Keep route-specific title, description, canonical, and Open Graph values in the same template/data source.
- Ensure articles remain usable with JavaScript disabled.

**Acceptance:** A direct HTML fetch of every sitemap URL contains its H1, article copy, internal links, and author information.

### 3. Return real 404 responses

**Why:** Unknown URLs currently return 200 with homepage content, creating soft 404s.

**Work:**

- Add an explicit Not Found route/page.
- Configure the production server to return HTTP 404 for unknown paths.
- Normalize trailing slashes with redirects instead of duplicate 200 responses where practical.

**Acceptance:** `/definitely-not-a-page` and `/notes/not-a-real-note` return 404 and are not canonicalized to the homepage.

## High — first week after the launch blockers

### 4. Add structured data

Implement and validate:

- `WebSite` + `Organization`/`ProfessionalService` on the homepage;
- `Person` on `/about`;
- `Article`/`BlogPosting` and `BreadcrumbList` on every field note;
- `Service` and `BreadcrumbList` on new service pages.

Use stable `@id` values to connect Ken, the site, and the provider. Do not use `LegalService` unless the legal/business facts support it.

### 5. Add visible article provenance

- Change “Filed by caio.legal” to “By Ken Erwin.”
- Link the author to `/about`.
- Add accurate publication and modification dates.
- Add a concise author bio/credential block.
- Add selective primary-source citations where a factual market or ethics claim is made.

### 6. Create intent-matched service pages

Publish substantial pages for:

- `/fractional-caio-law-firms`
- `/ai-governance-law-firms`
- `/law-firm-ai-exposure-assessment`

Each page should explain audience, problems, scope, process, deliverables/decisions, proof, boundaries, FAQ, and next step. Link to these pages from the homepage and relevant articles.

### 7. Complete social metadata

- Add a default 1200×630 branded image.
- Add article-specific images where useful.
- Add `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:url`, and `og:site_name`.
- Add Twitter summary-large-image tags.

### 8. Fix mobile render delay and article contrast

- Remove or shorten the delayed reveal on above-the-fold H1 text.
- Eliminate the Google Fonts CSS `@import` chain; self-host/subset/preload the critical font.
- Raise `--citation-gray` contrast for 11.84px article-aside labels from 4.31:1 to at least 4.5:1.

**Acceptance:** mobile lab LCP is below 2.5s on the homepage and article; Lighthouse accessibility returns 100 on the article.

## Medium — first month

### 9. Optimize and internalize images

- Host Ken's portrait on caio.legal.
- Generate AVIF/WebP variants and responsive sizes.
- Lazy-load the below-fold homepage instance.
- Keep explicit dimensions and useful alt text.

### 10. Improve titles and snippets

- Homepage: test `Fractional CAIO for Law Firms | caio.legal` or a close variant.
- About: include the law-firm AI leadership context.
- Shorten the 90-character “best AI workflow” article title tag while retaining the full H1.
- Enrich the shortest article descriptions with the audience/context where it reads naturally.

### 11. Build internal topic pathways

- Add related briefings to every article.
- Add contextual links between governance, adoption, economics, and leadership notes.
- Create a crawlable `/briefings` index.
- Add breadcrumbs.

### 12. Expand evidence-led content

Prioritize a small set of high-value pages before increasing volume:

- law-firm AI governance framework;
- AI vendor review checklist for law firms;
- responsible AI pilot template;
- executive AI briefing agenda;
- how to measure law-firm AI adoption;
- AI incident-response responsibilities;
- fractional CAIO vs. committee vs. full-time hire.

Include concise answer blocks, original frameworks, primary-source citations, and explicit links to relevant services.

## Low / ongoing

### 13. Add AI-discovery support

- Publish an optional `/llms.txt` with canonical links and a concise site description.
- Keep it aligned with the sitemap and visible information architecture.
- Treat it as supplemental, not a replacement for static HTML or schema.

### 14. Establish measurement

After launch:

- verify Google Search Console and Bing Webmaster Tools;
- submit `https://caio.legal/sitemap.xml`;
- inspect all six URLs;
- track non-brand impressions, indexed pages, CTR, qualified contact starts, and service-page conversions;
- capture the first SEO drift baseline;
- rerun Lighthouse and CrUX checks once field data exists.

## Suggested implementation sequence

1. DNS, HTTPS, canonical-host redirect.
2. Real static rendering and 404 behavior.
3. Schema, authorship/dates, social metadata.
4. Font/image/mobile performance fixes.
5. Three service pages and stronger internal linking.
6. Search Console/Bing setup and launch verification.
7. Content cluster expansion based on query/impression evidence.

