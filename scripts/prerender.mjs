import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve('dist')
const serverRoot = resolve('.ssr-dist')
const verificationRoot = resolve('.build-artifacts')
const shell = await readFile(resolve(root, 'index.html'), 'utf8')
const { contentManifest, render, routeMetadata, siteUrl, structuredDataForPath } = await import(pathToFileURL(resolve(serverRoot, 'entry-server.js')).href)

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function escapeXml(value) {
  return escapeAttribute(value).replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&apos;')
}

function replaceMeta(html, attribute, name, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${name}"\\s+content="[^"]*"\\s*\\/>`)
  return html.replace(pattern, `<meta ${attribute}="${name}" content="${escapeAttribute(content)}" />`)
}

for (const page of routeMetadata) {
  const rendered = render(page.pathname)
  const output = page.pathname === '/'
    ? 'index.html'
    : page.pathname === '/404'
      ? '404.html'
      : `${page.pathname.slice(1)}.html`
  const outputPath = resolve(root, output)
  let html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttribute(page.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`)

  html = replaceMeta(html, 'name', 'description', page.description)
  html = replaceMeta(html, 'property', 'og:title', page.title)
  html = replaceMeta(html, 'property', 'og:description', page.description)
  html = replaceMeta(html, 'property', 'og:type', page.type)
  html = replaceMeta(html, 'property', 'og:site_name', 'caio.legal')
  html = replaceMeta(html, 'property', 'og:image', page.image)
  html = replaceMeta(html, 'property', 'og:image:alt', page.imageAlt)
  html = replaceMeta(html, 'name', 'twitter:title', page.title)
  html = replaceMeta(html, 'name', 'twitter:description', page.description)
  html = replaceMeta(html, 'name', 'twitter:image', page.image)
  html = replaceMeta(html, 'name', 'twitter:image:alt', page.imageAlt)

  if (page.canonical) {
    html = replaceMeta(html, 'property', 'og:url', page.canonical)
    html = html.replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${page.canonical}" />`,
    )
  } else {
    html = html.replace(/\s*<link rel="canonical" href="[^"]*"\s*\/>/, '')
    html = html.replace(/\s*<meta property="og:url" content="[^"]*"\s*\/>/, '')
  }

  if (page.noindex) {
    html = html.replace('</head>', '    <meta name="robots" content="noindex, follow" />\n  </head>')
  }

  if (page.type === 'article') {
    html = html.replace(
      '</head>',
      `    <meta property="article:author" content="${siteUrl}/about" />\n    <meta property="article:published_time" content="${page.published}" />\n    <meta property="article:modified_time" content="${page.modified}" />\n  </head>`,
    )
  }

  const structuredData = structuredDataForPath(page.pathname)
  if (structuredData) {
    const serialized = JSON.stringify(structuredData).replaceAll('<', '\\u003c')
    html = html.replace('</head>', `    <script type="application/ld+json">${serialized}</script>\n  </head>`)
  }

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}

const sitemapPages = routeMetadata.filter((page) => page.canonical && !page.noindex)
const sitemapUrls = sitemapPages.map((page) => {
  if (!page.lastModified) throw new Error(`Missing sitemap lastModified for ${page.pathname}`)
  return [
    '  <url>',
    `    <loc>${escapeXml(page.canonical)}</loc>`,
    `    <lastmod>${page.lastModified}</lastmod>`,
    '  </url>',
  ].join('\n')
})
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls,
  '</urlset>',
  '',
].join('\n')

await writeFile(resolve(root, 'sitemap.xml'), sitemap)

await rm(verificationRoot, { recursive: true, force: true })
await mkdir(verificationRoot, { recursive: true })
await writeFile(resolve(verificationRoot, 'content-manifest.json'), `${JSON.stringify(contentManifest, null, 2)}\n`)

await rm(serverRoot, { recursive: true, force: true })
