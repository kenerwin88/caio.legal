import { useEffect, useState } from 'react'
import { essays, formatDate, routeMetadata, type Essay } from './site-data'

function setMetaContent(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute('content', content)
}

function updateDocumentMetadata(pathname: string) {
  const page = routeMetadata.find((route) => route.pathname === pathname)
  if (!page) return

  document.title = page.title
  setMetaContent('meta[name="description"]', page.description)
  setMetaContent('meta[property="og:title"]', page.title)
  setMetaContent('meta[property="og:description"]', page.description)
  setMetaContent('meta[property="og:type"]', page.type)
  setMetaContent('meta[property="og:site_name"]', 'caio.legal')
  setMetaContent('meta[property="og:image"]', page.image)
  setMetaContent('meta[property="og:image:alt"]', page.imageAlt)
  setMetaContent('meta[name="twitter:title"]', page.title)
  setMetaContent('meta[name="twitter:description"]', page.description)
  setMetaContent('meta[name="twitter:image"]', page.image)
  setMetaContent('meta[name="twitter:image:alt"]', page.imageAlt)
  if (page.canonical) setMetaContent('meta[property="og:url"]', page.canonical)

  const canonical = document.querySelector('link[rel="canonical"]')
  if (page.canonical) canonical?.setAttribute('href', page.canonical)
  else {
    canonical?.remove()
    document.querySelector('meta[property="og:url"]')?.remove()
  }
}

const notes = {
  use: {
    label: 'The operational reality',
    text: 'Lawyers are experimenting now—often faster than the firm can see, support, or govern.',
  },
  lead: {
    label: 'The accountability gap',
    text: 'The managing partner, office manager, IT provider, lawyers, and paralegals each see a piece. Who owns the outcome?',
  },
  change: {
    label: 'The exposure',
    text: 'Confidentiality, accuracy, privilege, supervision, and client obligations do not wait for a strategy.',
  },
}

type NoteKey = keyof typeof notes

function KenPortrait({ eager = false }: { eager?: boolean }) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet="/images/ken-erwin-400.avif 400w, /images/ken-erwin-800.avif 800w"
        sizes="(max-width: 700px) 100vw, 42vw"
      />
      <source
        type="image/webp"
        srcSet="/images/ken-erwin-400.webp 400w, /images/ken-erwin-800.webp 800w"
        sizes="(max-width: 700px) 100vw, 42vw"
      />
      <img
        src="/images/ken-erwin-800.jpg"
        alt="Ken Erwin"
        width="800"
        height="800"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
      />
    </picture>
  )
}

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function Header({ page = 'home' }: { page?: 'home' | 'article' | 'about' }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="caio.legal home">
        caio<span>.legal</span>
      </a>
      <nav aria-label="Main navigation">
        {page === 'article' ? (
          <a href="/#field-notes">Briefings</a>
        ) : page === 'about' ? (
          <>
            <a href="/#risk">Why CAIO</a>
            <a href="/#work">Advisory</a>
            <a href="/#field-notes">Briefings</a>
          </>
        ) : (
          <>
            <a href="#field-notes">Briefings</a>
            <a href="#work">Advisory</a>
            <a href="/about">About Ken</a>
          </>
        )}
      </nav>
      <a className="header-cta" href="mailto:hello@caio.legal?subject=AI%20leadership%20for%20our%20firm">
        Discuss your exposure <Arrow />
      </a>
    </header>
  )
}

function Hero() {
  const [activeNote, setActiveNote] = useState<NoteKey>('lead')
  const setNote = (key: NoteKey) => ({
    onMouseEnter: () => setActiveNote(key),
    onFocus: () => setActiveNote(key),
    onClick: () => setActiveNote(key),
  })

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-kicker reveal">Independent AI leadership for law firms</div>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 id="hero-title" className="reveal reveal-delay-1">
            AI is <button className={activeNote === 'use' ? 'active' : ''} {...setNote('use')}>already inside</button>{' '}
            your firm. The question is whether{' '}
            <button className={activeNote === 'lead' ? 'active' : ''} {...setNote('lead')}>anyone</button>{' '}
            is <button className={activeNote === 'change' ? 'active' : ''} {...setNote('change')}>leading it.</button>
          </h1>
          <div className="hero-bottom reveal reveal-delay-2">
            <p>
              Clients are asking. Attorneys are experimenting. Vendors are multiplying. Without one accountable leader, the firm carries the risk while better-prepared competitors learn faster.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="mailto:hello@caio.legal?subject=Our%20firm%27s%20AI%20exposure">Discuss your exposure <Arrow /></a>
              <a className="text-link" href="#risk">See what is at stake <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </div>
        <aside className="margin-note reveal reveal-delay-3" aria-live="polite">
          <div className="note-index">Margin note</div>
          <div className="note-mark" aria-hidden="true">*</div>
          <div className="note-content" key={activeNote}>
            <p className="note-label">{notes[activeNote].label}</p>
            <p className="note-text">{notes[activeNote].text}</p>
          </div>
          <div className="note-tabs" aria-label="Hero annotations">
            {(Object.keys(notes) as NoteKey[]).map((key) => (
              <button
                key={key}
                className={activeNote === key ? 'active' : ''}
                onClick={() => setActiveNote(key)}
                aria-label={`Show note: ${notes[key].label}`}
              />
            ))}
          </div>
        </aside>
      </div>
      <div className="hero-rule" aria-hidden="true" />
    </section>
  )
}

function Friction() {
  return (
    <section className="friction section-shell reveal" id="risk" aria-labelledby="friction-title">
      <div className="section-label">The exposure</div>
      <div className="section-content">
        <h2 id="friction-title">Doing nothing is not a neutral position.</h2>
        <p className="section-lede">
          AI adoption is already happening across law firms. The only question is whether it happens deliberately—or invisibly, until an incident, client, or competitor sets the agenda.
        </p>
        <div className="question-grid risk-grid">
          <article>
            <span>Shadow use</span>
            <h3>Sensitive information can enter tools the firm never approved.</h3>
            <p>Leadership may not know which systems lawyers use, what those systems retain, or whether client terms permit it.</p>
          </article>
          <article>
            <span>Work-product risk</span>
            <h3>Confident output can conceal unreliable reasoning.</h3>
            <p>Without defined review standards, hallucinated authority and missed context reach work product before anyone owns the failure.</p>
          </article>
          <article>
            <span>Client pressure</span>
            <h3>Clients want speed—and proof their information is protected.</h3>
            <p>Firms need credible answers about tools, supervision, billing, security, and the value clients actually receive.</p>
          </article>
          <article>
            <span>Competitive exposure</span>
            <h3>The firms learning safely today will compound that advantage.</h3>
            <p>A policy-only posture can limit incidents, but it cannot build the workflows, judgment, or confidence competitors are developing.</p>
          </article>
        </div>
        <div className="risk-verdict">
          <div>
            <span>Leadership test</span>
            <strong>If no one can answer these questions today, the firm already has an AI leadership problem.</strong>
          </div>
          <ul>
            <li>Which AI tools are attorneys actually using?</li>
            <li>Where is confidential or client information entering them?</li>
            <li>Who has authority to stop, approve, or scale a use case?</li>
          </ul>
          <a href="mailto:hello@caio.legal?subject=We%20need%20to%20understand%20our%20AI%20exposure">Start with a confidential conversation <Arrow /></a>
        </div>
      </div>
    </section>
  )
}

function CaioExplainer() {
  return (
    <section className="caio-explainer" aria-labelledby="caio-title">
      <div className="caio-definition reveal">
        <div className="caio-acronym" aria-hidden="true">CAIO</div>
        <p><strong>Chief Artificial Intelligence Officer</strong></p>
        <p>The executive responsible for how a firm chooses, governs, and puts AI to work.</p>
      </div>
      <div className="caio-case reveal">
        <div className="section-label">The missing role</div>
        <h2 id="caio-title">Every firm needs the leadership. Not every firm needs the full-time title.</h2>
        <p className="caio-lede">
          AI decisions now reach professional responsibility, client relationships, knowledge, talent, security, and firm economics. Without one accountable person, those decisions fall to whoever is closest to the problem—the managing partner, office manager, outside IT provider, or the lawyers and paralegals doing the work. Each can handle a piece, but no one is responsible for the whole.
        </p>
        <section className="capability-case reveal" id="capability" aria-labelledby="capability-title">
          <div className="capability-eyebrow">From isolated use to firm capability</div>
          <h3 id="capability-title">Your firm may already have excellent AI work. It is probably trapped inside one person’s process.</h3>
          <p>
            In nearly every firm, adoption is uneven. Some people have not begun. Some are experimenting in personal ChatGPT or Claude accounts. One lawyer or paralegal is often far ahead—but what they have learned is not visible, validated, or reusable across the firm. That creates risk and leaves valuable capability stranded.
          </p>
          <div className="capability-path" aria-label="How AI leadership scales firm knowledge">
            <article>
              <strong>Discover</strong>
              <p>Listen to lawyers and paralegals, map the work they actually perform, and find the techniques already producing better results.</p>
            </article>
            <article>
              <strong>Codify</strong>
              <p>Test the strongest workflows, define approved tools and review standards, and capture more than a prompt.</p>
            </article>
            <article>
              <strong>Scale</strong>
              <p>Train by role, share reusable patterns, support internal champions, and give improvements an accountable path through the firm.</p>
            </article>
          </div>
          <a href="/notes/your-best-ai-work-is-probably-hidden">Read the leadership briefing <Arrow /></a>
        </section>
        <div className="caio-responsibilities">
          <article>
            <h3>Set direction</h3>
            <p>Connect AI investment to firm strategy, client value, and the work lawyers actually perform.</p>
          </article>
          <article>
            <h3>Create decision rights</h3>
            <p>Make clear who evaluates risk, approves use, owns outcomes, and decides when a pilot is ready.</p>
          </article>
          <article>
            <h3>Build adoption</h3>
            <p>Turn isolated experiments into governed workflows, trained teams, and internal capability.</p>
          </article>
        </div>
        <div className="fractional-case">
          <strong>A fractional CAIO closes the leadership gap.</strong>
          <p>Firms get senior ownership now—without carrying a full-time executive role before the need, budget, or operating model is mature.</p>
        </div>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <div className="section-shell reveal">
        <div className="section-label light">CAIO advisory</div>
        <div className="section-content">
          <div className="work-heading">
            <h2 id="work-title">Get control before an incident sets the agenda.</h2>
            <p>I help firm leaders identify the exposure, establish ownership, and turn scattered AI activity into a governed operating plan.</p>
          </div>
          <div className="service-list">
            <article>
              <div className="service-type">Align leadership</div>
              <div>
                <h3>Executive AI risk briefings</h3>
                <p>Give partners a shared view of the capabilities, failure modes, professional obligations, and decisions the firm can no longer leave unresolved.</p>
              </div>
              <span className="service-audience">For leadership retreats, practice groups, and firmwide programs</span>
            </article>
            <article>
              <div className="service-type">Find the exposure</div>
              <div>
                <h3>Firm AI exposure assessment</h3>
                <p>Surface shadow use, governance gaps, priority workflows, and unclear ownership—then turn the findings into an executable response.</p>
              </div>
              <span className="service-audience">For teams ready to move from curiosity to repeatable practice</span>
            </article>
            <article>
              <div className="service-type">Own the response</div>
              <div>
                <h3>Fractional CAIO leadership</h3>
                <p>One accountable leader across priorities, governance, vendors, pilots, adoption, and internal ownership—without waiting for a full-time hire.</p>
              </div>
              <span className="service-audience">For firms that need leadership before they need a full-time CAIO</span>
            </article>
          </div>
          <a className="button button-light" href="mailto:hello@caio.legal?subject=AI%20training%20or%20fractional%20leadership">
            Tell me what your firm is navigating <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}

function FieldNotes() {
  return (
    <section className="field-notes section-shell" id="field-notes" aria-labelledby="notes-title">
      <div className="section-label reveal">CAIO briefings</div>
      <div className="section-content">
        <div className="notes-heading reveal">
          <h2 id="notes-title">Advice for the decisions ahead.</h2>
          <p>Clear positions on the choices AI is forcing law firm leaders to make.</p>
        </div>
        <div className="essay-list">
          {essays.map((essay, index) => (
            <a className="essay-card reveal" href={`/notes/${essay.slug}`} key={essay.slug}>
              <div className="essay-meta">
                <span>{essay.type}</span>
                <span>{essay.readTime}</span>
                <time dateTime={essay.published}>{formatDate(essay.published, 'short')}</time>
              </div>
              <h3>{essay.title}</h3>
              <p>{essay.deck}</p>
              <div className="essay-foot">
                <span className="essay-id">Filed {String(index + 1).padStart(2, '0')}</span>
                <span className="read-link">Read note <Arrow /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <figure className="about-portrait reveal">
        <KenPortrait />
        <figcaption>Ken Erwin · AWS Professional Services · Founder, LogicPearl and ParaLocker</figcaption>
      </figure>
      <div className="about-copy reveal">
        <div className="section-label light">Who is behind caio.legal</div>
        <h2 id="about-title">Technical depth, focused on legal work.</h2>
        <div className="about-text">
          <p>
            I’m Ken Erwin. I work with AWS Professional Services, where my experience includes AI infrastructure for Meta, event-scale resilience for Snapchat, recovery strategy for Pinterest, and conversational AI for Delta Air Lines. Earlier, I led cloud and automation initiatives at Salesforce, KAR, Angie’s List, and Interactive Intelligence.
          </p>
          <p>
            My focus on legal work began with a case of my own and an excellent attorney who patiently helped me understand the law behind it. That experience led me to build <a href="https://paralocker.com/" target="_blank" rel="noreferrer">ParaLocker</a>, a matter-centered platform shaped by the evidence, chronology, and collaboration demands legal teams face.
          </p>
        </div>
        <div className="about-proof" aria-label="Selected background">
          <span>Confidentiality and data flow</span>
          <span>Vendor and architecture scrutiny</span>
          <span>Resilience and recovery</span>
          <span>Adoption across the firm</span>
        </div>
        <div className="about-actions">
          <a className="button button-primary" href="/about">Why I do this <Arrow /></a>
          <a className="text-link" href="https://www.linkedin.com/in/kenerwin88/" target="_blank" rel="noreferrer">LinkedIn profile <Arrow /></a>
        </div>
      </div>
    </section>
  )
}

function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    updateDocumentMetadata('/about')
  }, [])

  return (
    <>
      <a className="skip-link" href="#about-ken">Skip to Ken’s background</a>
      <Header page="about" />
      <main id="about-ken" className="trust-page">
        <section className="trust-hero">
          <div className="trust-hero-copy">
            <div className="hero-kicker">Ken Erwin · AWS Professional Services · Founder, LogicPearl and ParaLocker</div>
            <h1>Law firms need AI leadership that understands the technology—<wbr />and the weight of the work.</h1>
            <p>
              I bring production AI, security, resilience, enterprise change, and product-building experience to a specific purpose: helping attorneys use AI without surrendering confidentiality, professional judgment, or control of the firm.
            </p>
            <div className="trust-record" aria-label="Selected company experience">
              <span>Selected experience</span>
              <ul>
                <li><strong>Amazon Web Services</strong><small>Professional Services</small></li>
                <li><strong>Meta</strong><small>AI infrastructure</small></li>
                <li><strong>Snapchat</strong><small>Event-scale resilience</small></li>
                <li><strong>Pinterest</strong><small>Recovery strategy</small></li>
                <li><strong>Delta Air Lines</strong><small>Conversational AI</small></li>
              </ul>
            </div>
          </div>
          <figure className="trust-portrait">
            <KenPortrait eager />
            <figcaption>Indianapolis, Indiana</figcaption>
          </figure>
        </section>

        <section className="scale-work" aria-labelledby="scale-title">
          <div className="scale-intro">
            <div className="section-label">Experience, translated</div>
            <h2 id="scale-title">What running critical systems taught me that a law firm can use.</h2>
            <p>In my work with Amazon Web Services, I operate where scale, resilience, recovery, and operational judgment are not abstractions. Each lesson maps directly to the decisions firms now face with AI.</p>
          </div>
          <div className="scale-grid">
            <article>
              <span>Meta</span>
              <h3>AI infrastructure</h3>
              <p>Ran high-performance computing clusters used in the development of Meta’s AI models.</p>
              <p className="firm-translation"><strong>For a law firm</strong>I understand what sits beneath an AI product—so I can press vendors on architecture, data movement, access, and the controls behind their promises.</p>
            </article>
            <article>
              <span>Snapchat</span>
              <h3>Event-scale resilience</h3>
              <p>Helped prepare systems for the concentrated New Year’s Eve traffic surge when millions of people send at once.</p>
              <p className="firm-translation"><strong>For a law firm</strong>I plan for failure, pressure, and incident response before a new workflow becomes something attorneys and clients depend on.</p>
            </article>
            <article>
              <span>Pinterest</span>
              <h3>Recovery strategy</h3>
              <p>Designed backup strategy around the question every critical system must answer: what happens when something fails?</p>
              <p className="firm-translation"><strong>For a law firm</strong>I treat continuity, recoverability, and control of client information as design requirements—not cleanup after a vendor or system fails.</p>
            </article>
            <article>
              <span>Delta Air Lines</span>
              <h3>Conversational AI</h3>
              <p>Built chatbot capability for a customer environment where reliability, clarity, and operational integration matter.</p>
              <p className="firm-translation"><strong>For a law firm</strong>I know a chatbot needs boundaries, escalation paths, testing, monitoring, and a clearly accountable human—not merely a polished interface.</p>
            </article>
          </div>
          <p className="scale-note">Selected engagements from Ken’s work with AWS. Company names identify project experience only and do not imply affiliation or endorsement.</p>
        </section>

        <section className="trust-proof" aria-labelledby="proof-title">
          <div className="section-label">Why this background matters</div>
          <div>
            <h2 id="proof-title">A firm needs more than an AI expert. It needs sound operating judgment.</h2>
            <div className="proof-grid">
              <article>
                <span>AI in production</span>
                <h3>Architecture beyond the demo</h3>
                <p>I work with AWS Professional Services on the architecture and operationalization of large-scale AI infrastructure and publish technical guidance for production conversational AI systems.</p>
                <strong>For your firm:</strong>
                <p>I can trace where client information goes, challenge security and privacy claims, and separate a compelling demonstration from a system the firm can responsibly support.</p>
              </article>
              <article>
                <span>Enterprise change</span>
                <h3>Years inside complex operating environments</h3>
                <p>My career includes leading automation and cloud initiatives at organizations including Salesforce, KAR, Angie’s List, and Interactive Intelligence.</p>
                <strong>For your firm:</strong>
                <p>I can turn partner priorities into ownership, policy, workflow, training, and measurable adoption across attorneys, paralegals, staff, and outside IT.</p>
              </article>
              <article>
                <span>Built close to the work</span>
                <h3>I build when the problem is worth solving</h3>
                <p>I founded ParaLocker after going through a legal case of my own. I was fortunate to work with an excellent attorney who patiently taught me the law behind the dispute. The experience showed me both the intellectual rigor of legal work and the burden of keeping evidence, chronology, and context connected.</p>
                <strong>For your firm:</strong>
                <p>I do not begin with technology. I begin with the people doing consequential work, the sources they must trust, the information they must protect, and the human judgment the system must support.</p>
                <div className="proof-links">
                  <a href="https://paralocker.com/" target="_blank" rel="noreferrer">Visit ParaLocker <Arrow /></a>
                </div>
              </article>
              <article>
                <span>Teacher and translator</span>
                <h3>Technical depth only matters if people can use it</h3>
                <p>I founded DevOps Library and have spent years writing courses, articles, and tools that make difficult technical ideas usable by working professionals.</p>
                <strong>For your firm:</strong>
                <p>I can give partners, attorneys, paralegals, and staff a common language without flattening the real risks or hiding behind jargon.</p>
                <a href="https://devopslibrary.com/" target="_blank" rel="noreferrer">Visit DevOps Library <Arrow /></a>
              </article>
            </div>
          </div>
        </section>

        <section className="trust-credentials" aria-labelledby="credentials-title">
          <div>
            <div className="section-label light">Foundation</div>
            <h2 id="credentials-title">Technical judgment for a professional-services firm.</h2>
          </div>
          <div className="credential-list">
            <p><strong>MBA, Entrepreneurship</strong><span>Indiana University Kelley School of Business</span></p>
            <p><strong>B.S., Informatics</strong><span>Indiana University</span></p>
            <p><strong>Security and infrastructure</strong><span>Security+, Network+, Microsoft, Puppet, Splunk, CloudBees, and SaltStack credentials</span></p>
            <p><strong>Public technical writing</strong><span>AI architecture, retrieval systems, infrastructure, automation, and software design</span></p>
          </div>
        </section>

        <aside className="service-note" aria-labelledby="service-note-title">
          <div className="section-label">A project built to help</div>
          <div>
            <h2 id="service-note-title">ScoutMyCase</h2>
            <p>I created ScoutMyCase as a free public resource because families facing brain cancer should not need technical expertise to find clinical trials worth discussing with their care team. It is something I chose to build because the problem mattered.</p>
            <a href="https://scoutmycase.com/" target="_blank" rel="noreferrer">Visit ScoutMyCase <Arrow /></a>
          </div>
        </aside>

        <section className="trust-position" aria-labelledby="position-title">
          <div className="section-label">Why legal work</div>
          <div>
            <h2 id="position-title">A legal case changed how I saw the work.</h2>
            <p>
              I was fortunate to work with a fantastic lawyer who was patient enough to help me understand the law governing my own case. Watching her turn facts, language, procedure, and judgment into a strategy gave me a lasting respect for the work—and showed me the practical burden attorneys and paralegals carry behind every matter. That experience led me to create ParaLocker.
            </p>
            <blockquote className="law-analogy">
              <p>As a technologist, law feels familiar: it is a system of rules expressed through language, where definitions, exceptions, evidence, and edge cases can change the outcome. But it also demands patience and human judgment that software cannot replace.</p>
            </blockquote>
            <p>
              That combination is why I care about legal work. It is also why I want firms to use AI carefully: to strengthen the people doing the reasoning, not weaken the standards their clients rely on.
            </p>
            <aside className="role-boundary">
              <strong>I am not a lawyer, and I do not give legal advice.</strong>
              <p>Attorneys own legal judgment and professional responsibility. I give firm leadership the technical and operating judgment to understand exposure, evaluate vendors, set policy, train the firm, and build an AI program attorneys can defend and sustain.</p>
            </aside>
            <div className="trust-links">
              <a className="button button-primary" href="mailto:hello@caio.legal?subject=AI%20leadership%20for%20our%20firm">Discuss your firm <Arrow /></a>
              <a href="https://www.linkedin.com/in/kenerwin88/" target="_blank" rel="noreferrer">Review my LinkedIn background <Arrow /></a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <p>Have a consequential AI decision in front of your firm?</p>
        <a href="mailto:hello@caio.legal?subject=A%20consequential%20AI%20decision">Let’s think it through. <Arrow /></a>
      </div>
      <div className="footer-bottom">
        <a className="brand footer-brand" href="/">caio<span>.legal</span></a>
        <p>AI leadership for law firms. This site provides education and commentary, not legal advice.</p>
        <p>© {new Date().getFullYear()} caio.legal</p>
      </div>
    </footer>
  )
}

function Home() {
  useEffect(() => {
    updateDocumentMetadata('/')

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))

    const hashTarget = window.location.hash.slice(1)
    let frame = 0
    if (hashTarget) {
      document.fonts.ready.then(() => {
        frame = requestAnimationFrame(() => document.getElementById(hashTarget)?.scrollIntoView())
      })
    }

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Friction />
        <CaioExplainer />
        <Work />
        <FieldNotes />
        <About />
      </main>
      <Footer />
    </>
  )
}

function ArticlePage({ essay }: { essay: Essay }) {
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    updateDocumentMetadata(`/notes/${essay.slug}`)
  }, [essay])

  useEffect(() => {
    const updateReadingProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight
      setReadingProgress(available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0)
    }

    updateReadingProgress()
    window.addEventListener('scroll', updateReadingProgress, { passive: true })
    window.addEventListener('resize', updateReadingProgress)
    return () => {
      window.removeEventListener('scroll', updateReadingProgress)
      window.removeEventListener('resize', updateReadingProgress)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#article">Skip to article</a>
      <progress className="article-progress" value={readingProgress} max="1" aria-label="Reading progress" />
      <Header page="article" />
      <main id="article" className="article-page">
        <header className="article-hero">
          <a className="article-back" href="/#field-notes">← All briefings</a>
          <div className="article-meta">
            <span>{essay.type}</span>
            <span>{essay.readTime}</span>
            <time dateTime={essay.published}>Published {formatDate(essay.published)}</time>
          </div>
          <h1>{essay.title}</h1>
          <p>{essay.deck}</p>
        </header>
        <article className="article-body">
          <aside>
            <span>Filed by</span>
            <strong>By <a href="/about">Ken Erwin</a></strong>
            <span>AI leadership advisor for law firms</span>
            <span className="author-credentials">AWS Professional Services · Founder, LogicPearl and ParaLocker</span>
            <span>Published</span>
            <time dateTime={essay.published}>{formatDate(essay.published)}</time>
          </aside>
          <div className="article-prose">
            {essay.body.map((section, index) => (
              <section key={index}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
            <section className="article-sources" aria-labelledby="sources-title">
              <h2 id="sources-title">Primary sources</h2>
              <ol>
                {essay.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                    <span>{source.publisher}</span>
                  </li>
                ))}
              </ol>
            </section>
            <div className="article-coda">
              <p>What decision is your firm trying to make?</p>
              <a href="mailto:hello@caio.legal?subject=A%20question%20from%20your%20field%20notes">Continue the conversation <Arrow /></a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}

function NotFoundPage() {
  useEffect(() => updateDocumentMetadata('/404'), [])

  return (
    <>
      <a className="skip-link" href="#not-found">Skip to content</a>
      <Header />
      <main id="not-found" className="article-page">
        <header className="article-hero">
          <div className="article-meta"><span>404</span><span>caio.legal</span></div>
          <h1>Page not found.</h1>
          <p>The page you requested does not exist or may have moved.</p>
          <a className="button button-light" href="/">Return home <Arrow /></a>
        </header>
      </main>
      <Footer />
    </>
  )
}

export function App({ pathname }: { pathname: string }) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  if (normalizedPath === '/about') return <AboutPage />
  const slug = normalizedPath.match(/^\/notes\/([^/]+)$/)?.[1]
  const essay = essays.find((item) => item.slug === slug)
  if (essay) return <ArticlePage essay={essay} />
  if (normalizedPath === '/') return <Home />
  return <NotFoundPage />
}
