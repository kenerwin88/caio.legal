# caio.legal SEO Audit

Audit date: 2026-07-17

Canonical target: `https://caio.legal/`

Audit type: live crawl plus repository, rendered-page, technical, content, on-page, schema, performance, image, AI-search, backlink, and SXO review

## Executive summary

**SEO health score: 72/100 — technically launch-ready, but not yet search-competitive**

The site is live, fast, crawlable, server-rendered, and internally consistent. All six sitemap URLs return `200`, contain their visible content in the initial HTML, expose one H1, use self-referencing canonicals, and pass the repository's production build verification. Unknown URLs now return a real `404`. These are major improvements over the earlier pre-launch state.

The limiting factors are now authority and search intent rather than basic crawlability. The site has no structured data, its four briefings lack named authorship and dates, three are under 300 words, commercial services are described only inside the homepage, and no branded result was found for `site:caio.legal` or the exact domain phrase. The domain was also absent from the latest available Common Crawl web graph. That is normal for a newly launched domain, but it means the next work should focus on discoverability, entity clarity, and pages that directly satisfy commercial search intent.

Business type detected: **B2B professional services and expert publication** for independent AI leadership, governance, adoption, and risk work in law firms. The site does not currently operate as a location-dependent local business, so local-pack/GBP factors are not included in the score.

### Score breakdown

| Category | Weight | Score | Weighted contribution |
|---|---:|---:|---:|
| Technical SEO | 22% | 91 | 20.0 |
| Content quality | 23% | 68 | 15.6 |
| On-page SEO | 20% | 81 | 16.2 |
| Schema / structured data | 10% | 20 | 2.0 |
| Performance / CWV proxy | 10% | 88 | 8.8 |
| AI-search readiness | 10% | 49 | 4.9 |
| Images | 5% | 83 | 4.2 |
| **Overall** | **100%** |  | **71.7 → 72** |

### Highest-priority issues

1. **High — no structured data exists on any page.** Search engines have to infer the site, author, articles, and services from prose alone.
2. **High — commercial intent has no dedicated landing pages.** The homepage cannot fully target fractional CAIO, AI governance consulting, exposure assessment, and training queries at the same time.
3. **High — article provenance is weak for a legal-adjacent YMYL topic.** Briefings show “Filed by caio.legal,” not a named author, and contain no publication or modification dates.
4. **High — the content footprint is small and shallow.** Three of four briefings contain 272–296 words, none cite primary sources, and none link to related briefings.
5. **High — the new domain is not yet visible in search or backlink datasets.** Exact-domain searches returned no result and Common Crawl did not contain the domain.

### Quick wins

1. Add a connected JSON-LD graph for `WebSite`, `Organization`, and `Person`; add `ProfilePage`, `BlogPosting`, and `BreadcrumbList` on the appropriate routes.
2. Replace “Filed by caio.legal” with “By Ken Erwin,” link the name to `/about`, and add accurate published/modified dates.
3. Add `og:url`, `og:site_name`, a 1200×630 `og:image`, and Twitter summary-card metadata.
4. Verify the property in Google Search Console and Bing Webmaster Tools, submit the sitemap, and inspect every canonical URL.
5. Add a crawlable briefings index and related-reading links between all four articles.

## Scope and evidence

The audit reviewed:

- the live homepage and every URL in `https://caio.legal/sitemap.xml`;
- initial server-delivered HTML and rendered desktop, laptop, tablet, and mobile views;
- status codes, redirect behavior, headers, robots directives, sitemap coverage, canonicals, and 404 handling;
- titles, descriptions, headings, internal/external links, article depth, authorship, dates, schema, images, and social metadata;
- lab performance heuristics and visual checks at multiple viewports;
- current search results for the domain and core positioning terms;
- Common Crawl domain-level backlink data;
- the repository's production build and verification commands.

Limitations:

- Google Search Console, GA4, Bing Webmaster, and Moz are not authenticated.
- PageSpeed Insights and CrUX API requests returned `403`; no field CWV data is available.
- Backlink coverage is limited to Common Crawl, which did not contain this new domain. Anchor text, link quality, and new/lost links cannot be scored.
- Search-result sampling is directional and location-neutral; it does not replace Search Console query data or controlled rank tracking.
- The audit's bundled sitemap analyzer falsely treated preload and stylesheet links as canonicals. Manual inspection confirmed that all six actual `<link rel="canonical">` values are correct.
- The bundled Lighthouse wrapper produced an impossible 102/100 score. Performance was rescored using the underlying lab metrics and capped conservatively.

## Technical SEO

### Technical score: 91/100

| Area | Status | Finding |
|---|---|---|
| HTTPS | Pass | Apex HTTPS returns `200`; HTTP redirects once to HTTPS. |
| Crawlability | Pass | `robots.txt` allows crawling and references the sitemap. |
| Sitemap | Pass | Valid XML; six canonical URLs; all return `200`; no redirected or noindexed entries. |
| Initial HTML | Pass | Critical copy, headings, links, and images are present before JavaScript runs. |
| Canonicals | Pass | All six sitemap URLs use correct self-referencing canonicals. |
| 404 handling | Pass | Unknown routes return HTTP `404` and the generated 404 is `noindex, follow`. |
| URL consistency | Pass | Trailing-slash variants redirect once to the canonical non-slash URL. |
| Mobile | Pass | Viewport is configured; no horizontal scroll or overlap was detected. |
| Security headers | Warn | CSP and HSTS are absent; existing X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy are good. |
| `www` host | Warn | `www.caio.legal` does not resolve, so it cannot redirect to the canonical apex. |
| IndexNow | Info | Not implemented; optional for faster Bing-family discovery. |

### Robots and AI crawler access

`robots.txt` contains a permissive wildcard rule. Googlebot and the major AI search crawlers are allowed, including OAI-SearchBot, ChatGPT-User, ClaudeBot, and PerplexityBot. No accidental block was found.

### Sitemap

The sitemap is clean and contains only the homepage, About page, and four briefings. It does not use ignored `<priority>` or `<changefreq>` tags. Add accurate `<lastmod>` values only after publication/modification dates become part of the content model.

### Technical recommendations

- Add HSTS after confirming HTTPS is permanent for every intended host.
- Add a restrictive, tested Content-Security-Policy that supports the current font, image, and Cloudflare behavior.
- Either configure `www.caio.legal` to redirect once to the apex or explicitly document that it will remain unconfigured.
- Add IndexNow only if Bing discovery speed is operationally useful; it is not a launch blocker.

## Content quality and E-E-A-T

### Content score: 68/100

The homepage and About page are distinctive, specific, and substantially stronger than generic AI-consulting copy. They show real operating experience, named companies, product-building history, educational work, and a clear boundary that Ken is not a lawyer. Those are meaningful Experience, Expertise, and Trust signals.

The briefing layer is much weaker. The articles are concise thought pieces rather than durable search resources:

| Page | Approx. words | Main gap |
|---|---:|---|
| `/notes/your-best-ai-work-is-probably-hidden` | 508 | Strongest briefing, but no named byline, date, sources, or related links. |
| `/notes/ai-policy-is-not-an-adoption-strategy` | 288 | Too little depth for a competitive governance/adoption query. |
| `/notes/billable-hour-is-not-the-first-change` | 296 | Original thesis, but no evidence, examples, or supporting sources. |
| `/notes/what-a-fractional-ai-leader-owns` | 272 | Commercially relevant, but too brief to satisfy comparison/evaluation intent. |

### E-E-A-T assessment

| Factor | Score | Evidence |
|---|---:|---|
| Experience | 17/25 | Production AI and resilience examples, legal product-building, and first-person operating perspective. |
| Expertise | 19/25 | Relevant technical background and credentials; article authorship is not explicitly connected to Ken. |
| Authoritativeness | 13/25 | External properties and LinkedIn exist, but the new domain has no detectable search/backlink footprint or citations. |
| Trustworthiness | 17/25 | HTTPS, contact route, About page, role boundary, and named experience; no privacy page, article dates, or editorial policy. |
| **Total** | **66/100** | Strong personal foundation, weak publication provenance and external validation. |

### Content recommendations

- Make Ken the visible author of every briefing and link to the About page.
- Add truthful `datePublished` and `dateModified` values to the data model and visible article header.
- Expand the strongest briefings with concrete examples, decision frameworks, and selective citations to primary sources such as bar opinions, NIST guidance, or vendor documentation.
- Add a short editorial note explaining the site's educational purpose and update practice.
- Add a privacy notice if analytics, forms, tracking, or lead-capture tooling is introduced.

## On-page SEO

### On-page score: 81/100

Strengths:

- All six indexable pages have unique titles, meta descriptions, H1s, and canonical URLs.
- Heading hierarchy is valid and descriptive.
- The homepage has 1,000+ words and links to every current page.
- The About page contains substantial proof and explicit expertise signals.
- Routes are short, descriptive, and stable.

Gaps:

- The 90-character title for “Your firm’s best AI workflow…” is likely to truncate heavily.
- Two other article titles are 64–65 characters and may truncate on narrower results.
- The homepage meta description is only 65 characters and undersells the service proposition.
- Article descriptions are concise but do not consistently name the law-firm audience.
- No `og:image`, `og:url`, `og:site_name`, or Twitter card tags are present.
- There is no crawlable `/briefings` hub, breadcrumb trail, or related-reading module.
- Each article links back to the homepage but not to another article or a dedicated service page.

## Schema and structured data

### Schema score: 20/100

No JSON-LD, Microdata, or RDFa was detected on any page. This does not block indexing, but it is a major missed opportunity for entity disambiguation and AI-search extraction.

Recommended graph:

- Homepage: `WebSite`, `Organization` or `ProfessionalService`, and `Person`, joined with stable `@id` values.
- About page: `ProfilePage` whose `mainEntity` is the same `Person`.
- Briefings: `BlogPosting` or `Article`, with `author`, `datePublished`, `dateModified`, `headline`, `description`, `mainEntityOfPage`, and publisher references.
- Briefings and future service pages: `BreadcrumbList`.
- Dedicated commercial pages: `Service` with a truthful provider, audience, area served if applicable, and description.

Do not use `LegalService` unless caio.legal is actually providing legal services. The current copy correctly says it does not provide legal advice. Do not add FAQPage merely for Google rich results; commercial FAQ rich results are restricted.

## Performance and Core Web Vitals

### Performance score: 88/100

The deterministic lab run reported:

| Metric | Result | Interpretation |
|---|---:|---|
| LCP | 1.64s | Good lab signal |
| CLS | 0.030 | Good |
| Interaction metric | 124ms | Good scripted signal; not CrUX field INP |
| TBT | 86.8ms | Good lab proxy |
| Initial HTML | ~15KB | Lean |
| Client JS | ~72KB gzip | Reasonable for the current site |
| CSS | ~6KB gzip | Lean |

These are lab/heuristic results, not 75th-percentile field data. PSI and CrUX APIs returned `403`, and the domain is too new for confirmed field CWV evidence.

Remaining risks:

- CSS begins with a Google Fonts `@import`, adding a stylesheet request chain before font downloads.
- The only content image is hosted on `devopslibrary.com`; it is a 102KB JPEG and creates a cross-origin dependency.
- Several homepage sections begin hidden and depend on JavaScript/IntersectionObserver to reveal. Initial HTML remains crawlable, but no-JS users could see hidden sections because CSS sets `.reveal { opacity: 0; }`.

Recommendations:

- Self-host and subset the critical fonts; preload only the weights actually used above the fold.
- Host Ken's portrait on caio.legal and serve AVIF/WebP with an appropriate fallback.
- Make reveal animations progressive enhancement: content should remain visible when JavaScript is unavailable.
- Recheck field CWV after the domain has enough Chrome traffic and API access is fixed.

## Images and visual review

### Image score: 83/100

The site uses one semantic `<img>` across the current content. It has useful alt text, explicit width/height, no oversized payload, and no missing dimension. The source is a 102KB JPEG.

Visual checks passed at desktop, laptop, tablet, and mobile widths:

- H1 and primary CTA are visible above the fold.
- No horizontal scroll or element overlap was detected.
- Base text is 17–18px and readable.
- The layout remains coherent at phone width.

The automated visual check flagged three undersized link targets on mobile: the brand link, the inline “Discuss your exposure” link, and the “See what is at stake” jump link. These are not catastrophic, but increasing vertical padding would improve touch ergonomics.

Saved evidence:

- `screenshots/caio_legal_desktop.png`
- `screenshots/caio_legal_laptop.png`
- `screenshots/caio_legal_tablet.png`
- `screenshots/caio_legal_mobile.png`

## AI-search / GEO readiness

### GEO score: 49/100

Strengths:

- Major AI search crawlers are allowed.
- Full content is server-rendered in initial HTML.
- The About page provides clear person/entity signals in prose.
- The homepage has clean headings, short paragraphs, and original positioning.

Gaps:

- No schema graph connects the brand, author, site, articles, and services.
- No `llms.txt` exists. This is an optional emerging convention, not a critical SEO requirement.
- No article has a named author, publication date, or cited source.
- The site contains few self-contained answer blocks and no comparison tables or reusable decision frameworks.
- Exact-domain searches returned no indexed result, so AI systems have little external evidence to corroborate the entity.

Highest-impact GEO work:

1. Implement the connected entity and article schema graph.
2. Publish a few evidence-led, source-cited resources that answer concrete law-firm AI questions.
3. Add visible bylines and dates.
4. Create dedicated service pages with answer-first definitions and clear deliverables.
5. Add `llms.txt` only after the canonical page set and authority content exist.

## Search experience (SXO)

### SXO gap score: 67/100

This score is separate from the 72/100 SEO health score.

#### Query: “AI leadership for law firms”

Current results are dominated by authoritative editorial and educational pages: industry reports, bar publications, major law-firm announcements, executive education, and association guidance. The dominant page type is **informational authority content**, while the caio.legal homepage is a **hybrid landing/service page**. Verdict: **high mismatch** for this query. A substantial guide or research-backed briefing is a better target than the homepage.

#### Query: “fractional AI leader law firm”

Results include dedicated fractional CTO/AI-leadership service pages and firms explicitly offering embedded governance/transformation leadership. The dominant page type is **service page**. caio.legal mentions fractional CAIO work on the homepage but has no dedicated route. Verdict: **high mismatch**.

### Persona scores

| Persona derived from result themes | Relevance | Clarity | Trust | Action | Total |
|---|---:|---:|---:|---:|---:|
| Managing partner seeking accountable AI ownership | 22 | 18 | 16 | 20 | 76 |
| Risk/IT evaluator comparing governance approaches | 20 | 17 | 15 | 19 | 71 |
| Knowledge or innovation leader driving adoption | 19 | 15 | 13 | 17 | 64 |
| Buyer comparing fractional AI leaders | 17 | 13 | 12 | 14 | 56 |

The weakest persona needs a page that states scope, process, deliverables, engagement boundaries, proof, and a low-friction next step. The current homepage provides good positioning but makes comparison difficult.

## Backlinks and off-site authority

### Backlink health: insufficient data (0/7 scoreable factors)

Available source: Common Crawl Web Graph, confidence 0.50. The domain was not present in release `cc-main-2026-jan-feb-mar`. No Moz, Bing Webmaster, or premium backlink source was configured.

This is a lack-of-data finding, not evidence of a toxic or weak profile. Do not create a disavow file. The appropriate next steps are:

- verify Google Search Console and Bing Webmaster Tools;
- earn a small number of relevant, editorial links and mentions from legal-tech, law-firm management, AI governance, and professional networks;
- connect caio.legal from Ken's established properties and profiles where contextually appropriate;
- publish link-worthy resources such as a governance decision framework, vendor review checklist, or anonymized operating benchmark.

## Local SEO applicability

Local SEO is **not scored**. The site names Indianapolis on the About page but does not present a public office, service radius, business hours, phone number, or local-intent offering. It is better modeled as a national/remote B2B advisory and publication. Do not add LocalBusiness/LegalService markup or pursue location pages unless the actual operating model becomes location-dependent.

## Priority summary

### High — next 1–2 weeks

1. Implement schema and entity linking.
2. Add article bylines, dates, author links, and source citations.
3. Create dedicated fractional CAIO, governance, and exposure-assessment service pages.
4. Verify Search Console/Bing and submit the sitemap.
5. Add complete social metadata and a branded social image.

### Medium — next month

1. Expand the three shortest briefings or replace them with deeper intent-matched resources.
2. Add a briefings index, breadcrumbs, related content, and contextual links to service pages.
3. Self-host fonts and the portrait; make reveal animations no-JS safe.
4. Configure `www`, HSTS, and a tested CSP.
5. Improve mobile touch target padding.

### Low / backlog

1. Add accurate sitemap `<lastmod>` values.
2. Add IndexNow for Bing-family discovery if useful.
3. Add an `llms.txt` file after the canonical information architecture stabilizes.
4. Configure Moz or Bing backlink data for a scoreable off-site audit.
