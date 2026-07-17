import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve('dist')
const serverRoot = resolve('.ssr-dist')
const shell = await readFile(resolve(root, 'index.html'), 'utf8')
const { render, routeMetadata } = await import(pathToFileURL(resolve(serverRoot, 'entry-server.js')).href)

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
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
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeAttribute(page.description)}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapeAttribute(page.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${escapeAttribute(page.description)}" />`,
    )
    .replace(
      /<meta property="og:type" content="[^"]*"\s*\/>/,
      `<meta property="og:type" content="${page.type}" />`,
    )
    .replace('<div id="root"></div>', `<div id="root">${rendered}</div>`)

  if (page.canonical) {
    html = html.replace(
      /<link rel="canonical" href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${page.canonical}" />`,
    )
  } else {
    html = html.replace(/\s*<link rel="canonical" href="[^"]*"\s*\/>/, '')
  }

  if (page.noindex) {
    html = html.replace('</head>', '    <meta name="robots" content="noindex, follow" />\n  </head>')
  }

  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}

await rm(serverRoot, { recursive: true, force: true })
