import { essays } from './article-content'
import type { Essay } from './content-types'

export type { Essay } from './content-types'

export const calendlyUrl = 'https://calendly.com/kenerwin/30min'
export const contactEmail = 'ken@caio.legal'
export const siteUrl = 'https://caio.legal'
const sitePublishedDate = '2026-07-17'

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatDate(date: string, format: 'long' | 'short' = 'long') {
  const formatter = format === 'long' ? longDateFormatter : shortDateFormatter
  return formatter.format(new Date(`${date}T12:00:00Z`))
}

export const essaysByNewest = [...essays].sort((a, b) =>
  b.published.localeCompare(a.published) || b.priority - a.priority,
)
export const homepageEssays = essaysByNewest.slice(0, 4)
const latestBriefingModifiedDate = essaysByNewest.reduce(
  (latest, essay) => essay.modified > latest ? essay.modified : latest,
  '1970-01-01',
)

export function articleImagePaths(essay: Essay) {
  return {
    social: `${essay.image.base}-1200x630.png`,
    socialWebp: `${essay.image.base}-1200x630.webp`,
    socialAvif: `${essay.image.base}-1200x630.avif`,
    fourByThree: `${essay.image.base}-1200x900.png`,
    square: `${essay.image.base}-1200x1200.png`,
  }
}

export const contentManifest = {
  articles: essaysByNewest.map((essay) => ({
    slug: essay.slug,
    pathname: `/notes/${essay.slug}`,
    canonical: `${siteUrl}/notes/${essay.slug}`,
    title: essay.title,
    seoTitle: essay.seoTitle,
    seoDescription: essay.seoDescription,
    published: essay.published,
    modified: essay.modified,
    image: {
      ...articleImagePaths(essay),
      alt: essay.image.alt,
      caption: essay.image.caption,
    },
    sources: essay.sources,
    inlineSources: [...new Set(essay.body.flatMap((section) => section.references ?? []).map((source) => source.url))],
  })),
  homepageArticlePaths: homepageEssays.map((essay) => `/notes/${essay.slug}`),
}

type RouteMetadata = {
  pathname: string
  title: string
  description: string
  type: 'website' | 'article' | 'profile'
  canonical: string | null
  image: string
  imageAlt: string
  published?: string
  modified?: string
  lastModified?: string
  noindex?: boolean
}

type SchemaNode = Record<string, unknown>

const websiteId = `${siteUrl}/#website`
const organizationId = `${siteUrl}/#organization`
const personId = `${siteUrl}/about#ken-erwin`
const socialImageUrl = `${siteUrl}/images/caio-legal-og.png`
const portraitUrl = `${siteUrl}/images/ken-erwin-800.jpg`
const socialImageAlt = 'caio.legal — independent AI leadership for law firms'
const aboutDescription = 'Ken Erwin brings production AI, security, resilience, enterprise change, and legal product-building experience to AI leadership for law firms.'

const serviceSchemas: SchemaNode[] = [
  {
    '@type': 'Service',
    '@id': `${siteUrl}/#executive-ai-risk-briefings`,
    name: 'Executive AI risk briefings',
    description: 'Leadership briefings on AI capabilities, failure modes, professional obligations, and the decisions a law firm must own.',
    provider: { '@id': organizationId },
    areaServed: { '@type': 'Country', name: 'United States' },
    audience: { '@type': 'BusinessAudience', audienceType: 'Law firm leaders, practice groups, and firmwide programs' },
  },
  {
    '@type': 'Service',
    '@id': `${siteUrl}/#firm-ai-exposure-assessment`,
    name: 'Firm AI exposure assessment',
    description: 'Assessment of shadow AI use, governance gaps, priority workflows, and unclear ownership, followed by an executable response plan.',
    provider: { '@id': organizationId },
    areaServed: { '@type': 'Country', name: 'United States' },
    audience: { '@type': 'BusinessAudience', audienceType: 'Law firms adopting artificial intelligence' },
  },
  {
    '@type': 'Service',
    '@id': `${siteUrl}/#fractional-caio-leadership`,
    name: 'Fractional CAIO leadership',
    description: 'Accountable AI leadership across priorities, governance, vendors, pilots, adoption, and internal ownership for law firms.',
    provider: { '@id': organizationId },
    areaServed: { '@type': 'Country', name: 'United States' },
    audience: { '@type': 'BusinessAudience', audienceType: 'Law firms that need AI leadership before a full-time CAIO' },
  },
]

const websiteSchema: SchemaNode = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: `${siteUrl}/`,
  name: 'caio.legal',
  description: 'Independent AI leadership, governance, and practical adoption guidance for law firms.',
  inLanguage: 'en-US',
  publisher: { '@id': organizationId },
}

const organizationSchema: SchemaNode = {
  '@type': 'ProfessionalService',
  '@id': organizationId,
  name: 'caio.legal',
  url: `${siteUrl}/`,
  description: 'Independent AI leadership for law firms, including executive briefings, exposure assessment, and fractional CAIO support.',
  email: 'ken@caio.legal',
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/favicon.svg`,
  },
  image: socialImageUrl,
  areaServed: { '@type': 'Country', name: 'United States' },
  founder: { '@id': personId },
}

const personSchema: SchemaNode = {
  '@type': 'Person',
  '@id': personId,
  name: 'Ken Erwin',
  url: `${siteUrl}/about`,
  image: {
    '@type': 'ImageObject',
    contentUrl: portraitUrl,
    caption: 'Ken Erwin',
  },
  jobTitle: 'Technology and AI leader',
  description: 'Technology leader with experience in production AI, security, resilience, enterprise change, and legal product building.',
  sameAs: ['https://www.linkedin.com/in/kenerwin88/'],
  knowsAbout: ['Artificial intelligence governance', 'AI infrastructure', 'Enterprise resilience', 'Law firm AI adoption'],
}

function commonSchemaGraph() {
  return [websiteSchema, organizationSchema, personSchema]
}

export const routeMetadata: RouteMetadata[] = [
  {
    pathname: '/',
    title: 'Fractional CAIO & AI Leadership for Law Firms | caio.legal',
    description: 'Independent AI leadership for law firms, including governance, exposure assessment, practical adoption, and fractional CAIO support grounded in operating experience.',
    type: 'website',
    canonical: `${siteUrl}/`,
    image: socialImageUrl,
    imageAlt: socialImageAlt,
    lastModified: latestBriefingModifiedDate,
  },
  {
    pathname: '/briefings',
    title: 'AI Briefings for Law Firm Leaders | caio.legal',
    description: 'Sourced AI briefings for managing partners, executive committees, practice leaders, and firm general counsel making governance, adoption, and investment decisions.',
    type: 'website',
    canonical: `${siteUrl}/briefings`,
    image: socialImageUrl,
    imageAlt: socialImageAlt,
    lastModified: latestBriefingModifiedDate,
  },
  ...essaysByNewest.map((essay) => ({
    pathname: `/notes/${essay.slug}`,
    title: essay.seoTitle,
    description: essay.seoDescription,
    type: 'article' as const,
    canonical: `${siteUrl}/notes/${essay.slug}`,
    image: `${siteUrl}${articleImagePaths(essay).social}`,
    imageAlt: essay.image.alt,
    published: essay.published,
    modified: essay.modified,
    lastModified: essay.modified,
  })),
  {
    pathname: '/about',
    title: 'Ken Erwin | AI Leadership for Law Firms | caio.legal',
    description: aboutDescription,
    type: 'profile',
    canonical: `${siteUrl}/about`,
    image: socialImageUrl,
    imageAlt: socialImageAlt,
    lastModified: sitePublishedDate,
  },
  {
    pathname: '/404',
    title: 'Page not found — caio.legal',
    description: 'The requested page could not be found.',
    type: 'website',
    canonical: null,
    image: socialImageUrl,
    imageAlt: socialImageAlt,
    noindex: true,
  },
]

export function structuredDataForPath(pathname: string): SchemaNode | null {
  if (pathname === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [...commonSchemaGraph(), ...serviceSchemas],
    }
  }

  if (pathname === '/briefings') {
    const briefingsUrl = `${siteUrl}/briefings`
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${briefingsUrl}#collection`,
          url: briefingsUrl,
          name: 'AI Briefings for Law Firm Leaders',
          description: 'Sourced guidance for managing partners, executive committees, practice leaders, and firm general counsel making consequential AI decisions.',
          isPartOf: { '@id': websiteId },
          inLanguage: 'en-US',
          dateModified: latestBriefingModifiedDate,
          mainEntity: {
            '@type': 'ItemList',
            '@id': `${briefingsUrl}#list`,
            itemListElement: essaysByNewest.map((essay, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: essay.title,
              url: `${siteUrl}/notes/${essay.slug}`,
            })),
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${briefingsUrl}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
            { '@type': 'ListItem', position: 2, name: 'Briefings', item: briefingsUrl },
          ],
        },
        ...commonSchemaGraph(),
      ],
    }
  }

  if (pathname === '/about') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          '@id': `${siteUrl}/about#profile-page`,
          url: `${siteUrl}/about`,
          name: 'Ken Erwin | AI Leadership for Law Firms',
          description: aboutDescription,
          isPartOf: { '@id': websiteId },
          mainEntity: { '@id': personId },
          dateModified: sitePublishedDate,
          inLanguage: 'en-US',
        },
        ...commonSchemaGraph(),
      ],
    }
  }

  const slug = pathname.match(/^\/notes\/([^/]+)$/)?.[1]
  const essay = essaysByNewest.find((item) => item.slug === slug)
  if (!essay) return null

  const canonical = `${siteUrl}/notes/${essay.slug}`
  const imagePaths = articleImagePaths(essay)
  const wordCount = essay.body
    .map((section) => section.markdown)
    .join(' ')
    .trim()
    .split(/\s+/).length

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${canonical}#article`,
        url: canonical,
        headline: essay.title,
        description: essay.seoDescription,
        datePublished: essay.published,
        dateModified: essay.modified,
        author: { '@id': personId },
        publisher: { '@id': organizationId },
        isPartOf: { '@id': websiteId },
        mainEntityOfPage: canonical,
        image: [
          {
            '@type': 'ImageObject',
            url: `${siteUrl}${imagePaths.social}`,
            width: 1200,
            height: 630,
            caption: essay.image.caption,
          },
          {
            '@type': 'ImageObject',
            url: `${siteUrl}${imagePaths.fourByThree}`,
            width: 1200,
            height: 900,
            caption: essay.image.caption,
          },
          {
            '@type': 'ImageObject',
            url: `${siteUrl}${imagePaths.square}`,
            width: 1200,
            height: 1200,
            caption: essay.image.caption,
          },
        ],
        articleSection: essay.type,
        wordCount,
        inLanguage: 'en-US',
        citation: essay.sources.map((source) => source.url),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Briefings', item: `${siteUrl}/briefings` },
          { '@type': 'ListItem', position: 3, name: essay.title, item: canonical },
        ],
      },
      ...commonSchemaGraph(),
    ],
  }
}
