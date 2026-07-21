import { parse } from 'yaml'

import type { Essay, EssayImage, EssaySection, Source } from './content-types'

type ArticleSource = Source & { id: string }

const frontMatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const sourceMarkerPattern = /^> \*\*Sources:\*\* (.+)$/
const inlineCitationPattern = /\[\[cite:([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g
const allowedFrontMatterKeys = new Set([
  'slug',
  'type',
  'title',
  'seoTitle',
  'deck',
  'seoDescription',
  'readTime',
  'published',
  'modified',
  'priority',
  'image',
  'sources',
])

const allowedImageKeys = new Set(['base', 'alt', 'caption', 'motif'])
const allowedImageMotifs = new Set<EssayImage['motif']>([
  'privilege-flow',
  'policy-path',
  'economics-flow',
  'leadership-hub',
  'hidden-network',
])

function fail(sourceName: string, message: string): never {
  throw new Error(`${sourceName}: ${message}`)
}

function record(value: unknown, sourceName: string, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(sourceName, `${label} must be a mapping`)
  }
  return value as Record<string, unknown>
}

function requiredString(value: unknown, sourceName: string, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    fail(sourceName, `${field} must be a non-empty string`)
  }
  return value.trim()
}

function parseSources(value: unknown, sourceName: string): ArticleSource[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(sourceName, 'sources must contain at least one authority')
  }

  const sources = value.map((item, index) => {
    const source = record(item, sourceName, `sources[${index}]`)
    const id = requiredString(source.id, sourceName, `sources[${index}].id`)
    const url = requiredString(source.url, sourceName, `sources[${index}].url`)
    if (!slugPattern.test(id)) fail(sourceName, `source ID "${id}" must be URL-safe`)
    if (!url.startsWith('https://')) fail(sourceName, `source "${id}" must use an HTTPS URL`)
    return {
      id,
      title: requiredString(source.title, sourceName, `sources[${index}].title`),
      publisher: requiredString(source.publisher, sourceName, `sources[${index}].publisher`),
      url,
    }
  })

  if (new Set(sources.map((source) => source.id)).size !== sources.length) {
    fail(sourceName, 'source IDs must be unique')
  }
  if (new Set(sources.map((source) => source.url)).size !== sources.length) {
    fail(sourceName, 'source URLs must be unique')
  }
  return sources
}

function parseImage(value: unknown, sourceName: string, slug: string): EssayImage {
  const image = record(value, sourceName, 'image')
  for (const key of Object.keys(image)) {
    if (!allowedImageKeys.has(key)) fail(sourceName, `unknown image field "${key}"`)
  }

  const base = requiredString(image.base, sourceName, 'image.base')
  const expectedBase = `/images/articles/${slug}`
  if (base !== expectedBase) {
    fail(sourceName, `image.base must be "${expectedBase}"`)
  }

  const alt = requiredString(image.alt, sourceName, 'image.alt')
  if (alt.length < 10 || alt.length > 180) {
    fail(sourceName, 'image.alt must be between 10 and 180 characters')
  }

  const motif = requiredString(image.motif, sourceName, 'image.motif') as EssayImage['motif']
  if (!allowedImageMotifs.has(motif)) {
    fail(sourceName, `image.motif must be one of: ${[...allowedImageMotifs].join(', ')}`)
  }

  return {
    base,
    alt,
    caption: requiredString(image.caption, sourceName, 'image.caption'),
    motif,
  }
}

function publicSource(source: ArticleSource): Source {
  return {
    title: source.title,
    publisher: source.publisher,
    url: source.url,
  }
}

function headingId(heading: string, sourceName: string): string {
  const id = heading
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  if (!id) fail(sourceName, `heading "${heading}" must contain URL-safe text`)
  return id
}

function expandInlineCitations(
  markdown: string,
  sourceById: Map<string, ArticleSource>,
  sourceName: string,
): string {
  const expanded = markdown.replace(inlineCitationPattern, (_marker, id: string, customLabel?: string) => {
    const source = sourceById.get(id)
    if (!source) fail(sourceName, `inline citation references unknown source "${id}"`)
    const label = customLabel?.trim() || source.title.split(',')[0].trim()
    if (!label) fail(sourceName, `inline citation for "${id}" must have a visible label`)
    return `[${label} ↗](${source.url} "Primary authority")`
  })

  if (expanded.includes('[[cite:')) {
    fail(sourceName, 'inline citations must use `[[cite:source-id]]` or `[[cite:source-id|Short label]]`')
  }
  return expanded
}

function parseBody(markdown: string, sources: ArticleSource[], sourceName: string): EssaySection[] {
  const sourceById = new Map(sources.map((source) => [source.id, source]))
  const sections: Array<Omit<EssaySection, 'markdown'> & { blocks: string[] }> = [{ blocks: [] }]
  const blocks = markdown.trim().split(/\r?\n\s*\r?\n/)

  for (const block of blocks) {
    if (block.startsWith('## ')) {
      const heading = block.slice(3).trim()
      if (!heading || heading.includes('\n')) fail(sourceName, 'each level-two heading must occupy one line')
      sections.push({ id: headingId(heading, sourceName), heading, blocks: [] })
      continue
    }
    if (/^#{1,6}\s/.test(block)) {
      fail(sourceName, 'article body headings must use level two syntax: ## Heading')
    }

    const marker = block.match(sourceMarkerPattern)
    if (marker) {
      const section = sections.at(-1)!
      if (section.references) fail(sourceName, `section "${section.heading ?? 'introduction'}" has more than one Sources marker`)
      const ids = marker[1].split(',').map((id) => id.trim()).filter(Boolean)
      if (!ids.length || new Set(ids).size !== ids.length) {
        fail(sourceName, `section "${section.heading ?? 'introduction'}" must list unique source IDs`)
      }
      section.references = ids.map((id) => {
        const source = sourceById.get(id)
        if (!source) fail(sourceName, `section "${section.heading ?? 'introduction'}" references unknown source "${id}"`)
        return publicSource(source)
      })
      continue
    }

    if (block.startsWith('> **Sources:**')) {
      fail(sourceName, 'source markers must use `> **Sources:** source-id`')
    }
    sections.at(-1)!.blocks.push(expandInlineCitations(block, sourceById, sourceName))
  }

  const populatedSections = sections.filter((section) => section.heading || section.blocks.length || section.references)
  if (!populatedSections.length) fail(sourceName, 'article body cannot be empty')
  for (const section of populatedSections) {
    if (!section.blocks.length) {
      fail(sourceName, `section "${section.heading ?? 'introduction'}" must contain at least one paragraph`)
    }
  }
  const headingIds = populatedSections.flatMap((section) => section.id ? [section.id] : [])
  if (new Set(headingIds).size !== headingIds.length) {
    fail(sourceName, 'level-two headings must produce unique section links')
  }
  return populatedSections.map(({ blocks, ...section }) => ({
    ...section,
    markdown: blocks.join('\n\n'),
  }))
}

export function parseArticleMarkdown(markdown: string, sourceName = 'article'): Essay {
  const match = markdown.match(frontMatterPattern)
  if (!match) fail(sourceName, 'must begin with YAML front matter enclosed by --- lines')

  let parsed: unknown
  try {
    parsed = parse(match[1])
  } catch (error) {
    fail(sourceName, `front matter is invalid YAML: ${error instanceof Error ? error.message : String(error)}`)
  }
  const data = record(parsed, sourceName, 'front matter')
  for (const key of Object.keys(data)) {
    if (!allowedFrontMatterKeys.has(key)) fail(sourceName, `unknown front matter field "${key}"`)
  }

  const slug = requiredString(data.slug, sourceName, 'slug')
  if (!slugPattern.test(slug)) fail(sourceName, 'slug must be URL-safe')
  const published = requiredString(data.published, sourceName, 'published')
  const modified = requiredString(data.modified, sourceName, 'modified')
  if (!isoDatePattern.test(published) || !isoDatePattern.test(modified)) {
    fail(sourceName, 'published and modified must use YYYY-MM-DD')
  }
  if (modified < published) fail(sourceName, 'modified cannot precede published')
  if (typeof data.priority !== 'number' || !Number.isInteger(data.priority) || data.priority < 1) {
    fail(sourceName, 'priority must be a positive integer')
  }

  const articleSources = parseSources(data.sources, sourceName)
  const sources = articleSources.map(publicSource)
  return {
    slug,
    type: requiredString(data.type, sourceName, 'type'),
    title: requiredString(data.title, sourceName, 'title'),
    seoTitle: requiredString(data.seoTitle, sourceName, 'seoTitle'),
    deck: requiredString(data.deck, sourceName, 'deck'),
    seoDescription: requiredString(data.seoDescription, sourceName, 'seoDescription'),
    readTime: requiredString(data.readTime, sourceName, 'readTime'),
    published,
    modified,
    priority: data.priority,
    image: parseImage(data.image, sourceName, slug),
    sources,
    body: parseBody(match[2], articleSources, sourceName),
  }
}
