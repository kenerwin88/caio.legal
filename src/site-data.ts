export type Essay = {
  slug: string
  type: string
  title: string
  seoTitle: string
  deck: string
  seoDescription: string
  readTime: string
  published: string
  modified: string
  sources: Source[]
  body: { heading?: string; paragraphs: string[] }[]
}

type Source = {
  title: string
  publisher: string
  url: string
}

const abaGenerativeAiOpinion: Source = {
  title: 'Formal Opinion 512: Generative Artificial Intelligence Tools',
  publisher: 'American Bar Association Standing Committee on Ethics and Professional Responsibility',
  url: 'https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf',
}

const nistGenerativeAiProfile: Source = {
  title: 'Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile',
  publisher: 'National Institute of Standards and Technology',
  url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf',
}

const nistAiRmfPlaybook: Source = {
  title: 'NIST AI Risk Management Framework Playbook',
  publisher: 'National Institute of Standards and Technology',
  url: 'https://www.nist.gov/itl/ai-risk-management-framework/nist-ai-rmf-playbook',
}

export const calendlyUrl = 'https://calendly.com/kenerwin/30min'
export const contactEmail = 'hello@caio.legal'

const publishedDate = '2026-07-17'
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

export const essays: Essay[] = [
  {
    slug: 'your-best-ai-work-is-probably-hidden',
    type: 'Leadership',
    title: 'Your firm’s best AI workflow may already exist—and no one else knows about it',
    seoTitle: 'Turn Hidden AI Workflows Into Firm Capability | caio.legal',
    deck: 'The gap is rarely curiosity. It is the leadership needed to discover, test, and scale what one lawyer or paralegal has learned.',
    seoDescription: 'Discover hidden AI workflows inside your law firm, evaluate their risks, and turn individual experimentation into governed, reusable institutional capability.',
    readTime: '6 min read',
    published: publishedDate,
    modified: publishedDate,
    sources: [abaGenerativeAiOpinion, nistGenerativeAiProfile],
    body: [
      {
        paragraphs: [
          'Nearly every law firm already has an AI adoption curve hiding inside it. Some people have not begun. Others are testing ChatGPT or Claude, sometimes through personal accounts the firm cannot see. And one lawyer, paralegal, or technically curious staff member is often far ahead—quietly using AI to improve a recurring part of the work.',
          'That unevenness is not evidence that the firm lacks interest. It is evidence that experimentation has outrun leadership. Useful techniques remain personal, risks remain inconsistent, and the firm receives little institutional value from what its strongest users have learned.',
        ],
      },
      {
        heading: 'A power user is not an operating model',
        paragraphs: [
          'A strong individual workflow can create real value, but it is fragile. It may depend on one person’s prompt history, personal account, undocumented judgment, or willingness to help colleagues between matters. If that person leaves, gets busy, or misunderstands a risk, the firm has no durable capability to fall back on.',
          'The goal is not to suppress experimentation. It is to create a path by which good experiments become visible, reviewable, teachable, and safe enough for others to use.',
        ],
      },
      {
        heading: 'Start with the work, not the tool',
        paragraphs: [
          'AI leadership begins by listening to the people closest to the workflow. What do paralegals repeatedly assemble, compare, extract, or chase? Where do associates lose time moving between sources? Which first drafts, chronologies, reviews, or client updates already benefit from AI? Who has found a better method, and what judgment makes it work?',
          'The leader’s job is to map the inputs, decisions, review points, source material, and failure modes around that method. A clever prompt is not yet a firm workflow. It becomes one only when the firm can explain when to use it, which tools and information are permitted, how output is checked, and who owns the result.',
        ],
      },
      {
        heading: 'Turn local learning into firm capability',
        paragraphs: [
          'Once a workflow proves useful, capture more than the prompt. Preserve the technique, approved tools, examples, source requirements, review standard, and known limits. Train the people who perform that work, identify internal champions, and give them a place to share improvements without creating a new shadow system.',
          'Not every lawyer needs to use AI identically. Practice groups differ, matters differ, and professional judgment remains personal. But the firm should have a shared baseline, reusable patterns, and a governed path for turning individual learning into collective advantage.',
        ],
      },
      {
        heading: 'That is the leadership gap',
        paragraphs: [
          'Tools do not discover the best work inside a firm. A policy does not spread it. A training session cannot sustain it by itself. Someone must connect the people experimenting, the workflows worth improving, the risks the firm must control, and the operating habits that make learning repeatable.',
          'The firms that pull ahead will not simply have more AI users. They will get better at learning from their best ones.',
        ],
      },
    ],
  },
  {
    slug: 'ai-policy-is-not-an-adoption-strategy',
    type: 'Governance',
    title: 'Your AI policy is not an adoption strategy',
    seoTitle: 'AI Policy Is Not an Adoption Strategy | caio.legal',
    deck: 'A policy can establish boundaries. It cannot teach a practice group how to change the work.',
    seoDescription: 'An AI policy sets boundaries, but law firm adoption requires workflow design, ownership, testing, training, and a practical path from permission to practice.',
    readTime: '6 min read',
    published: publishedDate,
    modified: publishedDate,
    sources: [abaGenerativeAiOpinion, nistAiRmfPlaybook],
    body: [
      {
        paragraphs: [
          'Most law firms began their AI work in the right place: protecting clients. They formed committees, reviewed tools, and published rules about confidential information. That work matters. But many firms are now asking a policy document to do a second job it was never designed to do.',
          'A policy tells people where the boundaries are. Adoption requires people to see a better way to complete a specific piece of work, trust the new method, and know who will help when it fails. Those are different conditions, owned by different people.',
        ],
      },
      {
        heading: 'The gap between permission and practice',
        paragraphs: [
          'When a firm approves a tool, it has answered a risk question. It has not answered a workflow question. Lawyers still need to decide where the tool belongs, how its output will be checked, whether the economics make sense, and how the result should be explained to a client.',
          'That is why broad training sessions often produce a burst of experimentation followed by quiet reversion. The tool was introduced, but the work was not redesigned.',
        ],
      },
      {
        heading: 'Build adoption around matters, not features',
        paragraphs: [
          'Start with one recurring task inside one willing team. Describe the current method, including review points and failure modes. Then test whether AI can improve speed, quality, consistency, or lawyer experience without weakening judgment. A useful pilot ends with a documented way of working—not a list of prompts.',
          'The firms that move well will treat governance and adoption as connected disciplines. Policy sets the perimeter. Practice leaders, knowledge teams, technologists, and lawyers build the path inside it.',
        ],
      },
    ],
  },
  {
    slug: 'billable-hour-is-not-the-first-change',
    type: 'Firm economics',
    title: 'The billable hour is not the first thing AI changes',
    seoTitle: 'How AI Changes Law Firm Economics Before Billing | caio.legal',
    deck: 'Before AI changes the pricing model, it changes who knows how the work actually gets done.',
    seoDescription: 'Before AI changes the billable hour, it exposes how legal work gets done. Learn why process visibility and client value should come before pricing redesign.',
    readTime: '7 min read',
    published: publishedDate,
    modified: publishedDate,
    sources: [abaGenerativeAiOpinion, nistGenerativeAiProfile],
    body: [
      {
        paragraphs: [
          'Conversations about AI and law-firm economics tend to leap straight to the billable hour. It is a compelling question, but it skips the more immediate shift already underway: firms are discovering how little of their production system has been made explicit.',
          'Ask how a strong first draft becomes a client-ready document and the answer often lives across habits, precedents, inboxes, and the judgment of a few trusted people. AI exposes that hidden system because a tool cannot reliably assist with a process the firm cannot describe.',
        ],
      },
      {
        heading: 'The first constraint is legibility',
        paragraphs: [
          'To automate or accelerate part of a matter, a team must name the inputs, decisions, handoffs, and standards that shape the output. This is not merely process mapping. It is the work of turning tacit expertise into a shared operating method without pretending judgment can be reduced to a checklist.',
          'That exercise changes where the firm sees value. The scarce resource may not be hours. It may be a partner’s review, a knowledge lawyer’s pattern recognition, or a client’s confidence that the team understands the commercial consequence.',
        ],
      },
      {
        heading: 'Price after you understand value',
        paragraphs: [
          'A firm should not redesign pricing from an abstract prediction about AI efficiency. It should first learn where time is removed, where new review is added, and whether the client experiences a better outcome. That evidence creates a serious conversation about scope and value.',
          'The economic question is coming. But the firms best positioned to answer it will be the ones that can see their own work clearly enough to know what changed.',
        ],
      },
    ],
  },
  {
    slug: 'what-a-fractional-ai-leader-owns',
    type: 'Leadership',
    title: 'What a fractional AI leader should own in a law firm',
    seoTitle: 'What a Fractional AI Leader Owns in a Law Firm | caio.legal',
    deck: 'Not the tools. The decisions that connect strategy, professional duty, and daily practice.',
    seoDescription: 'A fractional AI leader should own strategy, governance, vendor decisions, pilots, adoption, and the transition to permanent internal capability in a law firm.',
    readTime: '5 min read',
    published: publishedDate,
    modified: publishedDate,
    sources: [abaGenerativeAiOpinion, nistAiRmfPlaybook],
    body: [
      {
        paragraphs: [
          'A fractional AI leader should not become the firm’s most expensive prompt engineer. The role exists to create decision capacity while the firm builds the permanent leadership, governance, and operating habits it will eventually need.',
          'That means owning a coherent agenda across stakeholders who naturally see different parts of the problem: executive leadership, risk, IT, knowledge, innovation, talent, finance, and practice groups.',
        ],
      },
      {
        heading: 'A decision system, not a tool list',
        paragraphs: [
          'The work begins with a view of where the firm is trying to go and which constraints are real. From there, the leader should establish how opportunities are selected, how vendors are evaluated, how pilots graduate, and how learning is captured. Every initiative needs a business owner and a defined operational outcome.',
          'The role should also make tradeoffs visible. A tool may be technically capable but difficult to govern. A safe use case may have no meaningful adoption path. A popular experiment may not matter to clients or the firm’s strategy. Leadership is the act of naming those tensions early.',
        ],
      },
      {
        heading: 'The exit is part of the assignment',
        paragraphs: [
          'Fractional leadership succeeds when the firm becomes less dependent on it. The engagement should leave behind a prioritized portfolio, clear decision rights, trained internal owners, and a rhythm for reviewing evidence.',
          'AI will keep moving. The durable advantage is not knowing today’s tools. It is giving the firm a better way to decide what to do next.',
        ],
      },
    ],
  },
]

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

const siteUrl = 'https://caio.legal'
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
  email: 'hello@caio.legal',
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
    lastModified: publishedDate,
  },
  {
    pathname: '/briefings',
    title: 'CAIO Briefings: AI Decisions Facing Law Firms | caio.legal',
    description: 'Every caio.legal briefing on AI leadership, governance, firm economics, and adoption—clear positions on the decisions law firm leaders must now own.',
    type: 'website',
    canonical: `${siteUrl}/briefings`,
    image: socialImageUrl,
    imageAlt: socialImageAlt,
    lastModified: publishedDate,
  },
  ...essays.map((essay) => ({
    pathname: `/notes/${essay.slug}`,
    title: essay.seoTitle,
    description: essay.seoDescription,
    type: 'article' as const,
    canonical: `${siteUrl}/notes/${essay.slug}`,
    image: socialImageUrl,
    imageAlt: socialImageAlt,
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
    lastModified: publishedDate,
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
          name: 'CAIO Briefings: AI Decisions Facing Law Firms',
          description: 'Every caio.legal briefing on AI leadership, governance, firm economics, and adoption for law firms.',
          isPartOf: { '@id': websiteId },
          inLanguage: 'en-US',
          dateModified: publishedDate,
          mainEntity: {
            '@type': 'ItemList',
            '@id': `${briefingsUrl}#list`,
            itemListElement: essays.map((essay, index) => ({
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
          dateModified: publishedDate,
          inLanguage: 'en-US',
        },
        ...commonSchemaGraph(),
      ],
    }
  }

  const slug = pathname.match(/^\/notes\/([^/]+)$/)?.[1]
  const essay = essays.find((item) => item.slug === slug)
  if (!essay) return null

  const canonical = `${siteUrl}/notes/${essay.slug}`
  const wordCount = essay.body
    .flatMap((section) => section.paragraphs)
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
        image: {
          '@type': 'ImageObject',
          url: socialImageUrl,
          width: 1200,
          height: 630,
        },
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
