export type Source = {
  title: string
  publisher: string
  url: string
}

export type EssaySection = {
  id?: string
  heading?: string
  markdown: string
  references?: Source[]
}

export type EssayImage = {
  base: string
  alt: string
  caption: string
  motif: 'privilege-flow' | 'policy-path' | 'economics-flow' | 'leadership-hub' | 'hidden-network'
}

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
  priority: number
  image: EssayImage
  sources: Source[]
  body: EssaySection[]
}
