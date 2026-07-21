import { parseArticleMarkdown } from './article-markdown'
import type { Essay } from './content-types'

const markdownModules = import.meta.glob('../content/articles/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

export const essays: Essay[] = Object.entries(markdownModules).map(([path, markdown]) => {
  const essay = parseArticleMarkdown(markdown, path)
  const filename = path.split('/').at(-1)?.replace(/\.md$/, '')
  if (filename !== essay.slug) {
    throw new Error(`${path}: filename must match article slug "${essay.slug}"`)
  }
  return essay
})

const slugs = essays.map((essay) => essay.slug)
if (new Set(slugs).size !== slugs.length) {
  throw new Error('Article slugs must be unique')
}

const orderKeys = essays.map((essay) => `${essay.published}:${essay.priority}`)
if (new Set(orderKeys).size !== orderKeys.length) {
  throw new Error('Articles published on the same date must have unique priorities')
}
