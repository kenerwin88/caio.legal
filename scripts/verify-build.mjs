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
  assert.equal(new Set(article.sources.map((source) => source.url)).size, article.sources.length, `${article.slug} source URLs must be unique`)

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
  assert.equal(metaContent(html, 'property', 'og:image'), socialImage, `${page.file} must set og:image`)
  assert.equal(metaContent(html, 'property', 'og:image:width'), '1200', `${page.file} must set OG image width`)
  assert.equal(metaContent(html, 'property', 'og:image:height'), '630', `${page.file} must set OG image height`)
  assert.equal(metaContent(html, 'name', 'twitter:card'), 'summary_large_image', `${page.file} must set a large Twitter card`)
  assert.equal(metaContent(html, 'name', 'twitter:image'), socialImage, `${page.file} must set the Twitter image`)

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
    assert.match(html, /class="article-sources"/, `${page.file} must expose primary sources`)
    assert.match(html, /class="article-share"/, `${page.file} must expose sharing controls`)
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
    assert.deepEqual(article.citation, page.sources.map((source) => source.url), `${page.file} schema citations must match visible content data`)
    page.sources.forEach((source) => assert.ok(html.includes(source.url), `${page.file} must link primary source ${source.url}`))

    const breadcrumb = schemaNode(graph, 'BreadcrumbList')
    assert.deepEqual(breadcrumb.itemListElement.map((item) => item.position), [1, 2, 3], `${page.file} breadcrumb positions must be ordered`)
  }
}

const home = await readFile(resolve('dist', 'index.html'), 'utf8')
const about = await readFile(resolve('dist', 'about.html'), 'utf8')
const briefings = await readFile(resolve('dist', 'briefings.html'), 'utf8')
assert.deepEqual([...new Set(linkedArticlePaths(home))], manifest.homepageArticlePaths, 'Home must link only the four newest articles')
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

await access(resolve('dist', 'robots.txt'))
await access(resolve('dist', 'sitemap.xml'))

console.log(`Verified ${pages.length} rendered pages and ${articlePages.length} data-driven articles with complete SEO, provenance, sharing, and security controls.`)
