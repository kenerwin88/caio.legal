import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteUrl = 'https://caio.legal'
const socialImage = `${siteUrl}/images/caio-legal-og.png`
const publishedDate = '2026-07-17'
const websiteId = `${siteUrl}/#website`
const organizationId = `${siteUrl}/#organization`
const personId = `${siteUrl}/about#ken-erwin`

const pages = [
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
    file: 'notes/your-best-ai-work-is-probably-hidden.html',
    expectedText: 'Your firm’s best AI workflow',
    canonical: `${siteUrl}/notes/your-best-ai-work-is-probably-hidden`,
    schemaTypes: ['BlogPosting', 'BreadcrumbList', 'ProfessionalService', 'Person'],
    article: true,
  },
  {
    file: 'notes/ai-policy-is-not-an-adoption-strategy.html',
    expectedText: 'Your AI policy is not an adoption strategy',
    canonical: `${siteUrl}/notes/ai-policy-is-not-an-adoption-strategy`,
    schemaTypes: ['BlogPosting', 'BreadcrumbList', 'ProfessionalService', 'Person'],
    article: true,
  },
  {
    file: 'notes/billable-hour-is-not-the-first-change.html',
    expectedText: 'The billable hour is not the first thing AI changes',
    canonical: `${siteUrl}/notes/billable-hour-is-not-the-first-change`,
    schemaTypes: ['BlogPosting', 'BreadcrumbList', 'ProfessionalService', 'Person'],
    article: true,
  },
  {
    file: 'notes/what-a-fractional-ai-leader-owns.html',
    expectedText: 'What a fractional AI leader should own',
    canonical: `${siteUrl}/notes/what-a-fractional-ai-leader-owns`,
    schemaTypes: ['BlogPosting', 'BreadcrumbList', 'ProfessionalService', 'Person'],
    article: true,
  },
]

function metaContent(html, attribute, value) {
  const match = html.match(new RegExp(`<meta ${attribute}="${value}" content="([^"]+)"\\s*/?>`))
  return match?.[1]
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

for (const page of pages) {
  const html = await readFile(resolve('dist', page.file), 'utf8')
  assert.match(html, /<html lang="en" class="no-js">/, `${page.file} must default to no-JS-safe rendering`)
  assert.match(html, /<div id="root">\s*<(?!\/div>)/, `${page.file} must contain rendered HTML`)
  assert.match(html, /<h1[ >]/, `${page.file} must contain an H1 in the initial HTML`)
  assert.ok(html.includes(page.expectedText), `${page.file} must contain its page content`)
  assert.ok(html.includes(`<link rel="canonical" href="${page.canonical}" />`), `${page.file} must contain its canonical link element`)
  assert.doesNotMatch(html, /\/src\/main\.tsx/, `${page.file} must reference production assets`)

  const description = metaContent(html, 'name', 'description')
  assert.ok(description && description.length >= 100 && description.length <= 170, `${page.file} must have a useful meta description`)
  assert.equal(metaContent(html, 'property', 'og:url'), page.canonical, `${page.file} must set og:url`)
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

  if (page.article) {
    assert.match(html, /By <a href="\/about">Ken Erwin<\/a>/, `${page.file} must name and link the author`)
    assert.match(html, new RegExp(`<time dateTime="${publishedDate}">`), `${page.file} must expose its publication date`)
    assert.match(html, /class="article-sources"/, `${page.file} must expose primary sources`)
    assert.match(html, /americanbar\.org/, `${page.file} must cite the ABA's primary guidance`)
    assert.match(html, /(?:nist\.gov|nvlpubs\.nist\.gov)/, `${page.file} must cite NIST's primary guidance`)

    const article = schemaNode(graph, 'BlogPosting')
    assert.equal(article.datePublished, publishedDate, `${page.file} schema must carry the publication date`)
    assert.equal(article.dateModified, publishedDate, `${page.file} schema must carry the accurate modified date`)
    assert.equal(article.author['@id'], personId, `${page.file} schema must connect its author`)
    assert.equal(article.publisher['@id'], organizationId, `${page.file} schema must connect its publisher`)
    assert.equal(article.isPartOf['@id'], websiteId, `${page.file} schema must connect to the website`)

    const breadcrumb = schemaNode(graph, 'BreadcrumbList')
    assert.deepEqual(breadcrumb.itemListElement.map((item) => item.position), [1, 2, 3], `${page.file} breadcrumb positions must be ordered`)
  }
}

const home = await readFile(resolve('dist', 'index.html'), 'utf8')
const about = await readFile(resolve('dist', 'about.html'), 'utf8')
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
assert.match(headers, /script-src 'self'/, 'CSP must restrict scripts to the site')
assert.match(headers, /font-src 'self'/, 'CSP must support self-hosted fonts only')
assert.doesNotMatch(headers, /unsafe-inline/, 'CSP must not allow inline scripts or styles')

const sitemap = await readFile(resolve('dist', 'sitemap.xml'), 'utf8')
assert.equal((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) ?? []).length, pages.length, 'Every sitemap URL must have an ISO lastmod')
for (const page of pages) {
  assert.ok(
    sitemap.includes(`<loc>${page.canonical}</loc>\n    <lastmod>${publishedDate}</lastmod>`),
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

console.log(`Verified ${pages.length} rendered pages, complete metadata/schema, provenance, local assets, and security headers.`)
