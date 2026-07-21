# Editing briefings

Every published briefing is a Markdown file in `content/articles/`. Its filename must match its `slug`, and that slug becomes the permanent URL:

```text
content/articles/example-briefing.md → /notes/example-briefing
```

The YAML block at the top controls the title, description, dates, archive order, and cited authorities. The Markdown below it is the article body. The build converts both into prerendered HTML, metadata, canonical tags, JSON-LD, sitemap entries, and the full source record.

## Article template

```md
---
slug: example-briefing
type: Litigation risk
title: The visible article headline
seoTitle: Search-results title | caio.legal
deck: A short standfirst shown below the headline and on article cards.
seoDescription: A distinct 100–170 character summary written for search results and link previews.
readTime: 6 min read
published: 2026-07-20
modified: 2026-07-20
priority: 1
image:
  base: /images/articles/example-briefing
  alt: A concise description of the editorial graphic for readers who cannot see it.
  caption: The practical point the visual helps the reader understand.
  motif: privilege-flow
sources:
  - id: example-case
    title: Example v. Case, No. 00-0000
    publisher: U.S. Court of Appeals for the Example Circuit
    url: https://example.gov/opinion.pdf
---

Opening paragraphs do not need a heading. The page’s H1 comes from `title` above.

## A section heading

Use ordinary **Markdown** for emphasis, lists, and [links](https://example.com).

> A short, verified quotation from the authority can become a pull quote.
>
> — *Example v. Case* (Example Cir. 2026)

> **Sources:** example-case

The Sources line creates a highlighted “Read the authority” card for this section. Use the source’s `id`, not its URL. Separate multiple IDs with commas.

For an analytical sentence that needs immediate support, add a compact inline authority link using the same source ID:

**A clause can help create the record; it cannot create the privilege.** [[cite:example-case|Example v. Case]]

The optional text after `|` controls the short visible label. The source URL still comes from front matter, so it only needs to be maintained in one place.
```

## Publishing checks

- Use `##` for article section headings; the page title already supplies the only `h1`.
- Keep every authority in `sources`, even if it also appears in a highlighted section card.
- Use `[[cite:source-id]]` after an analytical proposition when readers should be able to inspect its authority immediately. Add `|Short label` when the full source title would interrupt the sentence.
- Keep pull quotes short, reproduce the source exactly, and identify the case and court beneath the quotation.
- Increase `modified` whenever the substance changes. `priority` breaks ties between articles published on the same date.
- Keep image metadata in front matter. `base` must match `/images/articles/{slug}`; `alt` describes the visual, while `caption` explains why it matters.
- Choose one supported `motif`: `privilege-flow`, `policy-path`, `economics-flow`, `leadership-hub`, or `hidden-network`. Run `npm run images:articles` after changing a title, type, or image motif.
- The image generator creates a 1200×630 social/on-page card plus 4:3 and 1:1 search variants. It also emits optimized AVIF and WebP files for the article page.
- Raw HTML is intentionally disabled. Use Markdown instead.
- Run `npm run check` before publishing. Invalid front matter, missing source IDs, duplicate URLs, broken SEO fields, or a filename/slug mismatch will fail the build.
