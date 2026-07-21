import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteUrl = 'https://caio.legal'
const socialImage = `${siteUrl}/images/caio-legal-og.png`
const websiteId = `${siteUrl}/#website`
const organizationId = `${siteUrl}/#organization`
const personId = `${siteUrl}/about#ken-erwin`
const isoDate = /^\d{4}-\d{2}-\d{2}$/

const manifest = JSON.parse(await readFile(resolve('.build-artifacts', 'content-manifest.json'), 'utf8'))
assert.ok(Array.isArray(manifest.articles) && manifest.articles.length > 0, 'Content manifest must include articles')
assert.ok(Array.isArray(manifest.homepageArticlePaths), 'Content manifest must identify homepage articles')
assert.ok(manifest.homepageArticlePaths.length <= 4, 'Homepage must show at most four articles')

const articleSlugs = manifest.articles.map((article) => article.slug)
const articlePaths = manifest.articles.map((article) => article.pathname)
const articleCanonicals = manifest.articles.map((article) => article.canonical)
const markdownArticleSlugs = (await readdir(resolve('content', 'articles')))
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.slice(0, -'.md'.length))
  .sort()
assert.deepEqual(markdownArticleSlugs, [...articleSlugs].sort(), 'Every manifest article must come from exactly one matching Markdown file')
assert.equal(new Set(articleSlugs).size, articleSlugs.length, 'Article slugs must be unique')
assert.equal(new Set(articlePaths).size, articlePaths.length, 'Article paths must be unique')
assert.equal(new Set(articleCanonicals).size, articleCanonicals.length, 'Article canonicals must be unique')
assert.deepEqual(
  manifest.homepageArticlePaths,
  articlePaths.slice(0, 4),
  'Homepage articles must be the four newest articles in archive order',
)

for (const [index, article] of manifest.articles.entries()) {
  assert.match(article.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${article.slug} must be a URL-safe slug`)
  assert.equal(article.pathname, `/notes/${article.slug}`, `${article.slug} pathname must match its slug`)
  assert.equal(article.canonical, `${siteUrl}${article.pathname}`, `${article.slug} canonical must match its pathname`)
  assert.ok(article.title, `${article.slug} must have a title`)
  assert.ok(article.seoTitle, `${article.slug} must have an SEO title`)
  assert.ok(article.seoDescription?.length >= 100 && article.seoDescription.length <= 170, `${article.slug} must have a useful SEO description`)
  assert.match(article.published, isoDate, `${article.slug} must have an ISO publication date`)
  assert.match(article.modified, isoDate, `${article.slug} must have an ISO modified date`)
  assert.ok(article.modified >= article.published, `${article.slug} modified date cannot precede publication`)
  assert.ok(Array.isArray(article.sources) && article.sources.length > 0, `${article.slug} must cite at least one primary source`)
  assert.ok(Array.isArray(article.inlineSources), `${article.slug} must identify its inline sources`)
  assert.ok(article.image && typeof article.image === 'object', `${article.slug} must define article image metadata`)
  assert.equal(article.image.social, `/images/articles/${article.slug}-1200x630.png`, `${article.slug} must use its own social image`)
  assert.equal(article.image.socialWebp, `/images/articles/${article.slug}-1200x630.webp`, `${article.slug} must define a WebP article image`)
  assert.equal(article.image.socialAvif, `/images/articles/${article.slug}-1200x630.avif`, `${article.slug} must define an AVIF article image`)
  assert.equal(article.image.fourByThree, `/images/articles/${article.slug}-1200x900.png`, `${article.slug} must define a 4:3 search image`)
  assert.equal(article.image.square, `/images/articles/${article.slug}-1200x1200.png`, `${article.slug} must define a square search image`)
  assert.ok(article.image.alt?.length >= 10 && article.image.alt.length <= 180, `${article.slug} image must have useful alt text`)
  assert.ok(article.image.caption, `${article.slug} image must explain its editorial purpose`)
  assert.equal(new Set(article.sources.map((source) => source.url)).size, article.sources.length, `${article.slug} source URLs must be unique`)
  assert.equal(new Set(article.inlineSources).size, article.inlineSources.length, `${article.slug} inline source URLs must be unique`)

  const sourceUrls = new Set(article.sources.map((source) => source.url))
  article.inlineSources.forEach((url) => assert.ok(sourceUrls.has(url), `${article.slug} inline sources must also appear in its full source record`))

  for (const source of article.sources) {
    assert.ok(source.title, `${article.slug} sources must have titles`)
    assert.ok(source.publisher, `${article.slug} sources must name their publishers`)
    assert.match(source.url, /^https:\/\//, `${article.slug} sources must use HTTPS URLs`)
  }

  if (index > 0) {
    assert.ok(
      manifest.articles[index - 1].published >= article.published,
      'Article manifest must be ordered newest first',
    )
  }
}

const staticPages = [
  {
    file: 'index.html',
    expectedText: 'AI is',
    canonical: `${siteUrl}/`,
    schemaTypes: ['WebSite', 'ProfessionalService', 'Person', 'Service'],
  },
  {
    file: 'about.html',
    expectedText: 'Law firms need AI leadership',
    canonical: `${siteUrl}/about`,
    schemaTypes: ['ProfilePage', 'ProfessionalService', 'Person'],
  },
  {
    file: 'briefings.html',
    expectedText: 'Decisions your partnership can defend.',
    canonical: `${siteUrl}/briefings`,
    schemaTypes: ['CollectionPage', 'ItemList', 'BreadcrumbList', 'ProfessionalService', 'Person'],
  },
]

const articlePages = manifest.articles.map((article) => ({
  ...article,
  file: `notes/${article.slug}.html`,
  expectedText: article.title,
  schemaTypes: ['BlogPosting', 'BreadcrumbList', 'ProfessionalService', 'Person'],
  article: true,
}))
const pages = [...staticPages, ...articlePages]

const builtNoteFiles = (await readdir(resolve('dist', 'notes')))
  .filter((file) => file.endsWith('.html'))
  .map((file) => file.slice(0, -'.html'.length))
  .sort()
assert.deepEqual(builtNoteFiles, [...articleSlugs].sort(), 'Every article must produce exactly one note page')

function metaContent(html, attribute, value) {
  const match = html.match(new RegExp(`<meta ${attribute}="${value}" content="([^"]+)"\\s*/?>`))
  return match?.[1]
}

function documentTitle(html) {
  return html.match(/<title>([^<]+)<\/title>/)?.[1]
}

function collectSchemaTypes(value, types = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaTypes(item, types))
  } else if (value && typeof value === 'object') {
    const type = value['@type']
    if (Array.isArray(type)) type.forEach((item) => types.add(item))
    else if (type) types.add(type)
    Object.values(value).forEach((item) => collectSchemaTypes(item, types))
  }
  return types
}

function schemaNode(graph, type) {
  return graph.find((node) => node['@type'] === type)
}

function linkedArticlePaths(html) {
  return [...html.matchAll(/href="(\/notes\/[a-z0-9-]+)"/g)].map((match) => match[1])
}

const pageTitles = new Set()
const pageDescriptions = new Set()

for (const page of pages) {
  const html = await readFile(resolve('dist', page.file), 'utf8')
  assert.match(html, /<html lang="en" class="no-js">/, `${page.file} must default to no-JS-safe rendering`)
  assert.match(html, /<div id="root">\s*<(?!\/div>)/, `${page.file} must contain rendered HTML`)
  assert.match(html, /<h1[ >]/, `${page.file} must contain an H1 in the initial HTML`)
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, `${page.file} must contain exactly one H1`)
  assert.ok(html.includes(page.expectedText), `${page.file} must contain its page content`)
  assert.ok(html.includes(`<link rel="canonical" href="${page.canonical}" />`), `${page.file} must contain its canonical link element`)
  assert.doesNotMatch(html, /\/src\/main\.tsx/, `${page.file} must reference production assets`)
  assert.ok(html.includes('static.cloudflareinsights.com/beacon.min.js'), `${page.file} must include the analytics beacon`)

  const title = documentTitle(html)
  const description = metaContent(html, 'name', 'description')
  assert.ok(title, `${page.file} must have a document title`)
  assert.ok(!pageTitles.has(title), `${page.file} must have a unique document title`)
  assert.ok(description && description.length >= 100 && description.length <= 170, `${page.file} must have a useful meta description`)
  assert.ok(!pageDescriptions.has(description), `${page.file} must have a unique meta description`)
  pageTitles.add(title)
  pageDescriptions.add(description)

  if (page.article) {
    assert.equal(title, page.seoTitle, `${page.file} title must match its content data`)
    assert.equal(description, page.seoDescription, `${page.file} description must match its content data`)
  }

  assert.equal(metaContent(html, 'property', 'og:url'), page.canonical, `${page.file} must set og:url`)
  assert.equal(metaContent(html, 'property', 'og:title'), title, `${page.file} OG title must match the document title`)
  assert.equal(metaContent(html, 'property', 'og:description'), description, `${page.file} OG description must match the meta description`)
  assert.equal(metaContent(html, 'property', 'og:site_name'), 'caio.legal', `${page.file} must set og:site_name`)
  const expectedImage = page.article ? `${siteUrl}${page.image.social}` : socialImage
  const expectedImageAlt = page.article ? page.image.alt : 'caio.legal — independent AI leadership for law firms'
  assert.equal(metaContent(html, 'property', 'og:image'), expectedImage, `${page.file} must set its correct og:image`)
  assert.equal(metaContent(html, 'property', 'og:image:width'), '1200', `${page.file} must set OG image width`)
  assert.equal(metaContent(html, 'property', 'og:image:height'), '630', `${page.file} must set OG image height`)
  assert.equal(metaContent(html, 'property', 'og:image:alt'), expectedImageAlt, `${page.file} must describe its OG image`)
  assert.equal(metaContent(html, 'name', 'twitter:card'), 'summary_large_image', `${page.file} must set a large Twitter card`)
  assert.equal(metaContent(html, 'name', 'twitter:image'), expectedImage, `${page.file} must set its correct Twitter image`)
  assert.equal(metaContent(html, 'name', 'twitter:image:alt'), expectedImageAlt, `${page.file} must describe its Twitter image`)

  const schemaMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  assert.equal(schemaMatches.length, 1, `${page.file} must contain one initial-HTML JSON-LD graph`)
  const schema = JSON.parse(schemaMatches[0][1])
  assert.equal(schema['@context'], 'https://schema.org', `${page.file} schema must use the HTTPS Schema.org context`)
  assert.doesNotMatch(JSON.stringify(schema), /\[[A-Z][^\]]+\]/, `${page.file} schema must not contain placeholders`)
  const schemaTypes = collectSchemaTypes(schema)
  page.schemaTypes.forEach((type) => assert.ok(schemaTypes.has(type), `${page.file} schema must include ${type}`))

  const graph = schema['@graph']
  assert.ok(Array.isArray(graph), `${page.file} schema must use a graph`)
  const nodeIds = graph.map((node) => node['@id']).filter(Boolean)
  assert.equal(new Set(nodeIds).size, nodeIds.length, `${page.file} schema node IDs must be unique`)
  assert.equal(schemaNode(graph, 'WebSite').publisher['@id'], organizationId, `${page.file} website must connect to the service`)
  assert.equal(schemaNode(graph, 'ProfessionalService').founder['@id'], personId, `${page.file} service must connect to its founder`)
  assert.equal(schemaNode(graph, 'Person')['@id'], personId, `${page.file} must use the stable person ID`)

  if (page.file === 'index.html') {
    const services = graph.filter((node) => node['@type'] === 'Service')
    assert.equal(services.length, 3, 'Home schema must describe all three visible services')
    services.forEach((service) => assert.equal(service.provider['@id'], organizationId, `${service.name} must connect to its provider`))
  }

  if (page.file === 'about.html') {
    const profile = schemaNode(graph, 'ProfilePage')
    assert.equal(profile.mainEntity['@id'], personId, 'About profile must connect to Ken Erwin')
    assert.equal(profile.isPartOf['@id'], websiteId, 'About profile must connect to the website')
  }

  if (page.file === 'briefings.html') {
    const collection = schemaNode(graph, 'CollectionPage')
    assert.equal(collection.isPartOf['@id'], websiteId, 'Briefings collection must connect to the website')
    assert.deepEqual(
      collection.mainEntity.itemListElement.map((item) => item.url),
      articleCanonicals,
      'Briefings ItemList must include every article in newest-first order',
    )
  }

  if (page.article) {
    assert.match(html, /<strong><a href="\/about">Ken Erwin<\/a><\/strong>/, `${page.file} must name and link the author`)
    assert.match(html, new RegExp(`<time dateTime="${page.published}">`), `${page.file} must expose its publication date`)
    assert.match(html, /<nav class="article-toc article-toc-desktop" aria-labelledby="article-toc-title-desktop">/, `${page.file} must expose desktop section navigation`)
    assert.match(html, /<nav class="article-toc article-toc-mobile" aria-labelledby="article-toc-title-mobile">/, `${page.file} must expose mobile section navigation after its introduction`)
    assert.match(html, /class="article-prose"><section>[\s\S]*?<\/section><nav class="article-toc article-toc-mobile"/, `${page.file} mobile navigation must follow its introduction`)
    assert.match(html, /class="article-sources"/, `${page.file} must expose primary sources`)
    assert.match(html, /class="article-share"/, `${page.file} must expose sharing controls`)
    assert.match(html, /<figure class="article-visual">/, `${page.file} must show its editorial visual after the introduction`)
    assert.match(html, new RegExp(`<source srcSet="${page.image.socialAvif}" type="image/avif"`), `${page.file} must offer an AVIF article image`)
    assert.match(html, new RegExp(`<source srcSet="${page.image.socialWebp}" type="image/webp"`), `${page.file} must offer a WebP article image`)
    assert.ok(html.includes(`<img src="${page.image.social}" alt="${page.image.alt}" width="1200" height="630" loading="lazy" decoding="async"/>`), `${page.file} must render a sized, lazy-loaded article image`)
    assert.ok(html.includes(page.image.caption), `${page.file} must visibly explain its editorial image`)
    assert.ok(html.includes('linkedin.com/sharing/share-offsite'), `${page.file} must support LinkedIn sharing`)
    assert.ok(html.includes('mailto:'), `${page.file} must support email sharing`)
    assert.ok(html.includes(`data-share-url="${page.canonical}"`), `${page.file} must support copying its canonical URL`)

    const article = schemaNode(graph, 'BlogPosting')
    assert.equal(article.url, page.canonical, `${page.file} schema URL must match its canonical`)
    assert.equal(article.headline, page.title, `${page.file} schema headline must match its content data`)
    assert.equal(article.description, page.seoDescription, `${page.file} schema description must match its content data`)
    assert.equal(article.datePublished, page.published, `${page.file} schema must carry the publication date`)
    assert.equal(article.dateModified, page.modified, `${page.file} schema must carry the modified date`)
    assert.equal(article.author['@id'], personId, `${page.file} schema must connect its author`)
    assert.equal(article.publisher['@id'], organizationId, `${page.file} schema must connect its publisher`)
    assert.equal(article.isPartOf['@id'], websiteId, `${page.file} schema must connect to the website`)
    assert.ok(Array.isArray(article.image) && article.image.length === 3, `${page.file} schema must provide 16:9, 4:3, and 1:1 images`)
    assert.deepEqual(
      article.image.map((image) => image.url),
      [page.image.social, page.image.fourByThree, page.image.square].map((path) => `${siteUrl}${path}`),
      `${page.file} schema image URLs must match its generated variants`,
    )
    assert.deepEqual(
      article.image.map((image) => [image.width, image.height]),
      [[1200, 630], [1200, 900], [1200, 1200]],
      `${page.file} schema must describe each image ratio`,
    )
    assert.deepEqual(article.citation, page.sources.map((source) => source.url), `${page.file} schema citations must match visible content data`)
    page.sources.forEach((source) => assert.ok(html.includes(source.url), `${page.file} must link primary source ${source.url}`))
    page.inlineSources.forEach((url) => {
      assert.ok(
        html.includes(`class="authority-link" href="${url}"`),
        `${page.file} must link ${url} beside the discussion it supports`,
      )
    })

    const desktopToc = html.match(/<nav class="article-toc article-toc-desktop"[\s\S]*?<\/nav>/)?.[0]
    const mobileToc = html.match(/<nav class="article-toc article-toc-mobile"[\s\S]*?<\/nav>/)?.[0]
    assert.ok(desktopToc && mobileToc, `${page.file} must render both responsive navigation placements`)
    const sectionTargets = [...desktopToc.matchAll(/class="article-toc-link" href="#([a-z0-9-]+)"/g)]
      .map((match) => match[1])
    const mobileSectionTargets = [...mobileToc.matchAll(/class="article-toc-link" href="#([a-z0-9-]+)"/g)]
      .map((match) => match[1])
    assert.ok(sectionTargets.length > 0, `${page.file} section navigation must contain links`)
    assert.equal(new Set(sectionTargets).size, sectionTargets.length, `${page.file} section navigation targets must be unique`)
    assert.deepEqual(mobileSectionTargets, sectionTargets, `${page.file} responsive section navigation must expose the same targets`)
    sectionTargets.forEach((target) => {
      assert.ok(html.includes(`<h2 id="${target}">`), `${page.file} section navigation must target heading #${target}`)
    })
    if (page.slug === 'ai-in-court-2026-rules-privilege-pro-se') {
      assert.equal((html.match(/<blockquote>/g) ?? []).length, 7, `${page.file} must render one pull quote for each discussed case`)
      const heppnerSource = page.sources.find((source) => source.title.startsWith('United States v. Heppner'))
      const abaSource = page.sources.find((source) => source.title.startsWith('Formal Opinion 512'))
      assert.ok(heppnerSource && abaSource, `${page.file} must retain the engagement-letter authorities`)
      assert.ok(
        html.includes(`<strong>A clause can help create the record; it cannot create the privilege.</strong> <a href="${heppnerSource.url}" class="inline-authority" target="_blank" rel="noreferrer">Heppner ↗</a> <a href="${abaSource.url}" class="inline-authority" target="_blank" rel="noreferrer">ABA Formal Opinion 512 ↗</a>`),
        `${page.file} must link the engagement-letter analysis directly to Heppner and ABA Formal Opinion 512`,
      )
    }

    const breadcrumb = schemaNode(graph, 'BreadcrumbList')
    assert.deepEqual(breadcrumb.itemListElement.map((item) => item.position), [1, 2, 3], `${page.file} breadcrumb positions must be ordered`)
  }
}

const home = await readFile(resolve('dist', 'index.html'), 'utf8')
const about = await readFile(resolve('dist', 'about.html'), 'utf8')
const briefings = await readFile(resolve('dist', 'briefings.html'), 'utf8')
const homepageBriefings = home.match(/<section class="field-notes section-shell"[\s\S]*?<\/section>/)?.[0]
assert.ok(homepageBriefings, 'Home must contain its briefings section')
assert.deepEqual(
  [...new Set(linkedArticlePaths(homepageBriefings))],
  manifest.homepageArticlePaths,
  'Home briefings section must link the four newest articles in order',
)
assert.deepEqual([...new Set(linkedArticlePaths(briefings))], articlePaths, 'Briefings archive must link every article in newest-first order')
assert.doesNotMatch(home, /devopslibrary\.com\/assets\/img\/authors/, 'Home must not hotlink the portrait')
assert.doesNotMatch(about, /devopslibrary\.com\/assets\/img\/authors/, 'About must not hotlink the portrait')
for (const html of [home, about]) {
  assert.match(html, /<source[^>]+type="image\/avif"/, 'Portraits must offer AVIF')
  assert.match(html, /<source[^>]+type="image\/webp"/, 'Portraits must offer WebP')
}

const notFound = await readFile(resolve('dist', '404.html'), 'utf8')
assert.match(notFound, /<h1[ >]/, '404.html must contain a rendered H1')
assert.ok(notFound.includes('Page not found'), '404.html must contain the not-found message')
assert.match(notFound, /name="robots" content="noindex, follow"/, '404.html must be noindex')
assert.doesNotMatch(notFound, /application\/ld\+json/, '404.html must not contain entity schema')

const headers = await readFile(resolve('dist', '_headers'), 'utf8')
assert.match(headers, /Strict-Transport-Security: max-age=31536000/, 'Headers must enable HSTS')
assert.match(headers, /Content-Security-Policy:/, 'Headers must define a CSP')
assert.match(headers, /script-src 'self' https:\/\/static\.cloudflareinsights\.com/, 'CSP must allow only site scripts and the analytics beacon')
assert.match(headers, /connect-src 'self' https:\/\/cloudflareinsights\.com/, 'CSP must allow analytics beacon reporting')
assert.match(headers, /font-src 'self'/, 'CSP must support self-hosted fonts only')
assert.doesNotMatch(headers, /unsafe-inline/, 'CSP must not allow inline scripts or styles')

const sitemap = await readFile(resolve('dist', 'sitemap.xml'), 'utf8')
assert.equal((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) ?? []).length, pages.length, 'Every sitemap URL must have an ISO lastmod')
for (const page of pages) {
  const expectedDate = page.article ? page.modified : '\\d{4}-\\d{2}-\\d{2}'
  assert.match(
    sitemap,
    new RegExp(`<loc>${page.canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>\\s*<lastmod>${expectedDate}</lastmod>`),
    `Sitemap must carry the canonical URL and current modified date for ${page.file}`,
  )
}

const cssFiles = await readdir(resolve('dist', 'assets'))
const cssName = cssFiles.find((name) => name.endsWith('.css'))
assert.ok(cssName, 'Build must emit CSS')
const css = await readFile(resolve('dist', 'assets', cssName), 'utf8')
assert.doesNotMatch(css, /fonts\.googleapis\.com|fonts\.gstatic\.com/, 'CSS must not load remote fonts')
assert.match(css, /\.js \.reveal/, 'Reveal animations must only hide content after JavaScript starts')
assert.match(css, /min-height:44px/, 'CSS must include 44px coarse-pointer touch targets')
assert.match(css, /--citation-gray:#646b77/, 'CSS must use accessible article metadata contrast')
assert.match(css, /@media\s*\((?:max-width:860px|width<=860px)\)/, 'CSS must stack article content before tablet lines become narrow')
assert.match(css, /@media print/, 'CSS must include print-optimized article styles')

for (const asset of [
  'images/caio-legal-og.png',
  'images/ken-erwin-400.avif',
  'images/ken-erwin-800.avif',
  'images/ken-erwin-400.webp',
  'images/ken-erwin-800.webp',
  'images/ken-erwin-800.jpg',
  'fonts/ibm-plex-sans-latin.woff2',
  'fonts/ibm-plex-mono-latin.woff2',
  'fonts/source-serif-4-latin.woff2',
]) await access(resolve('dist', asset))

const png = await readFile(resolve('dist', 'images/caio-legal-og.png'))
assert.equal(png.readUInt32BE(16), 1200, 'OG image must be 1200px wide')
assert.equal(png.readUInt32BE(20), 630, 'OG image must be 630px tall')

for (const article of manifest.articles) {
  for (const [path, width, height] of [
    [article.image.social, 1200, 630],
    [article.image.fourByThree, 1200, 900],
    [article.image.square, 1200, 1200],
  ]) {
    const image = await readFile(resolve('dist', path.slice(1)))
    assert.equal(image.readUInt32BE(16), width, `${path} must be ${width}px wide`)
    assert.equal(image.readUInt32BE(20), height, `${path} must be ${height}px tall`)
  }
  await access(resolve('dist', article.image.socialWebp.slice(1)))
  await access(resolve('dist', article.image.socialAvif.slice(1)))
}

await access(resolve('dist', 'robots.txt'))
await access(resolve('dist', 'sitemap.xml'))

console.log(`Verified ${pages.length} rendered pages and ${articlePages.length} Markdown articles with complete SEO, provenance, sharing, and security controls.`)
