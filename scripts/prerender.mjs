import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const pages = [
  {
    pathname: '/',
    output: 'index.html',
    title: 'caio.legal — AI leadership for law firms',
    description: 'Practical AI leadership, training, and field notes for law firms.',
    type: 'website',
    canonical: 'https://caio.legal/',
  },
  {
    pathname: '/notes/your-best-ai-work-is-probably-hidden',
    output: 'notes/your-best-ai-work-is-probably-hidden.html',
    title: 'Your firm’s best AI workflow may already exist—and no one else knows about it',
    description: 'The leadership work of discovering, testing, and scaling what one lawyer or paralegal has already learned about AI.',
    type: 'article',
    canonical: 'https://caio.legal/notes/your-best-ai-work-is-probably-hidden',
  },
  {
    pathname: '/notes/ai-policy-is-not-an-adoption-strategy',
    output: 'notes/ai-policy-is-not-an-adoption-strategy.html',
    title: 'Your AI policy is not an adoption strategy',
    description: 'A policy can establish boundaries. It cannot teach a practice group how to change the work.',
    type: 'article',
    canonical: 'https://caio.legal/notes/ai-policy-is-not-an-adoption-strategy',
  },
  {
    pathname: '/notes/billable-hour-is-not-the-first-change',
    output: 'notes/billable-hour-is-not-the-first-change.html',
    title: 'The billable hour is not the first thing AI changes',
    description: 'Before AI changes the pricing model, it changes who knows how the work actually gets done.',
    type: 'article',
    canonical: 'https://caio.legal/notes/billable-hour-is-not-the-first-change',
  },
  {
    pathname: '/notes/what-a-fractional-ai-leader-owns',
    output: 'notes/what-a-fractional-ai-leader-owns.html',
    title: 'What a fractional AI leader should own in a law firm',
    description: 'Not the tools. The decisions that connect strategy, professional duty, and daily practice.',
    type: 'article',
    canonical: 'https://caio.legal/notes/what-a-fractional-ai-leader-owns',
  },
  {
    pathname: '/about',
    output: 'about.html',
    title: 'About Ken Erwin',
    description: 'Ken Erwin brings production AI, security, resilience, enterprise change, and legal product-building experience to AI leadership for law firms.',
    type: 'profile',
    canonical: 'https://caio.legal/about',
  },
  {
    pathname: '/404',
    output: '404.html',
    title: 'Page not found',
    description: 'The requested page could not be found.',
    type: 'website',
    canonical: null,
    noindex: true,
  },
]

const root = resolve('dist')
const serverRoot = resolve('.ssr-dist')
const shell = await readFile(resolve(root, 'index.html'), 'utf8')
const { render } = await import(pathToFileURL(resolve(serverRoot, 'entry-server.js')).href)

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

for (const page of pages) {
  const title = page.pathname === '/' ? page.title : `${page.title} — caio.legal`
  const rendered = render(page.pathname)
  const outputPath = resolve(root, page.output)
  let html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttribute(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escapeAttribute(page.description)}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${escapeAttribute(title)}" />`,
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
