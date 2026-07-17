import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const pages = [
  ['index.html', 'AI is', 'https://caio.legal/'],
  ['about.html', 'Law firms need AI leadership', 'https://caio.legal/about'],
  [
    'notes/your-best-ai-work-is-probably-hidden.html',
    'Your firm’s best AI workflow',
    'https://caio.legal/notes/your-best-ai-work-is-probably-hidden',
  ],
  [
    'notes/ai-policy-is-not-an-adoption-strategy.html',
    'Your AI policy is not an adoption strategy',
    'https://caio.legal/notes/ai-policy-is-not-an-adoption-strategy',
  ],
  [
    'notes/billable-hour-is-not-the-first-change.html',
    'The billable hour is not the first thing AI changes',
    'https://caio.legal/notes/billable-hour-is-not-the-first-change',
  ],
  [
    'notes/what-a-fractional-ai-leader-owns.html',
    'What a fractional AI leader should own',
    'https://caio.legal/notes/what-a-fractional-ai-leader-owns',
  ],
]

for (const [file, expectedText, canonical] of pages) {
  const html = await readFile(resolve('dist', file), 'utf8')
  assert.match(html, /<div id="root">\s*<(?!\/div>)/, `${file} must contain rendered HTML`)
  assert.match(html, /<h1[ >]/, `${file} must contain an H1 in the initial HTML`)
  assert.ok(html.includes(expectedText), `${file} must contain its page content`)
  assert.ok(html.includes(`href="${canonical}"`), `${file} must contain its canonical URL`)
  assert.doesNotMatch(html, /\/src\/main\.tsx/, `${file} must reference production assets`)
}

const notFound = await readFile(resolve('dist', '404.html'), 'utf8')
assert.match(notFound, /<h1[ >]/, '404.html must contain a rendered H1')
assert.ok(notFound.includes('Page not found'), '404.html must contain the not-found message')
assert.match(notFound, /name="robots" content="noindex, follow"/, '404.html must be noindex')

await access(resolve('dist', '_headers'))
await access(resolve('dist', 'robots.txt'))
await access(resolve('dist', 'sitemap.xml'))

console.log(`Verified ${pages.length} rendered pages, 404 handling, and Cloudflare assets.`)
