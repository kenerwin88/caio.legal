import { mkdir, readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import sharp from 'sharp'
import { parse } from 'yaml'

const articleRoot = resolve('content', 'articles')
const outputRoot = resolve('public', 'images', 'articles')
const frontMatterPattern = /^---\r?\n([\s\S]*?)\r?\n---/

const palette = {
  navy: '#11142f',
  blue: '#3157ff',
  rose: '#f05b70',
  paper: '#f2f5fb',
  white: '#ffffff',
  paleBlue: '#aebcff',
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function wrapHeadline(title, maxCharacters) {
  const words = title.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && candidate.length > maxCharacters) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function textLines(lines, x, y, fontSize, lineHeight) {
  return `<text x="${x}" y="${y}" fill="${palette.white}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="-2">${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('')}</text>`
}

function pill(x, y, width, label, fill = palette.navy, stroke = palette.paleBlue) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="44" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="2" />
    <text x="${x + width / 2}" y="${y + 28}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">${escapeXml(label)}</text>`
}

function privilegeFlow(x, y, width, height) {
  const center = x + width / 2
  const top = y + 55
  const gap = Math.max(72, (height - 190) / 2)
  return `
    <text x="${center}" y="${y + 24}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2">WHEN PRIVILEGE IS TESTED</text>
    ${pill(center - 73, top, 146, 'CLIENT')}
    <line x1="${center}" y1="${top + 44}" x2="${center}" y2="${top + gap}" stroke="${palette.white}" stroke-width="3" />
    <path d="M ${center - 7} ${top + gap - 9} L ${center} ${top + gap} L ${center + 7} ${top + gap - 9}" fill="none" stroke="${palette.white}" stroke-width="3" />
    ${pill(center - 103, top + gap, 206, 'CONSUMER AI', palette.rose, palette.white)}
    <line x1="${x + 22}" y1="${top + gap + 66}" x2="${x + width - 22}" y2="${top + gap + 66}" stroke="${palette.rose}" stroke-width="3" stroke-dasharray="8 8" />
    <text x="${center}" y="${top + gap + 91}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">DISCLOSURE BOUNDARY</text>
    <line x1="${center}" y1="${top + gap + 103}" x2="${center}" y2="${top + gap * 2}" stroke="${palette.white}" stroke-width="3" />
    <path d="M ${center - 7} ${top + gap * 2 - 9} L ${center} ${top + gap * 2} L ${center + 7} ${top + gap * 2 - 9}" fill="none" stroke="${palette.white}" stroke-width="3" />
    ${pill(center - 78, top + gap * 2, 156, 'COUNSEL')}`
}

function policyPath(x, y, width, height) {
  const left = x + 38
  const startY = y + 54
  const rowGap = Math.max(68, (height - 118) / 4)
  const labels = ['WORKFLOW', 'TESTING', 'TRAINING', 'ADOPTION']
  return `
    <text x="${left}" y="${y + 24}" fill="${palette.white}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2">BOUNDARY → PRACTICE</text>
    <line x1="${left}" y1="${startY}" x2="${left}" y2="${y + height - 26}" stroke="${palette.rose}" stroke-width="8" />
    <text x="${left + 20}" y="${startY + 4}" fill="${palette.white}" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700">POLICY</text>
    ${labels.map((label, index) => {
      const itemY = startY + 56 + index * rowGap
      const itemX = left + 28 + index * Math.min(22, width * 0.04)
      return `<line x1="${left + 5}" y1="${itemY - 6}" x2="${itemX - 8}" y2="${itemY - 6}" stroke="${palette.paleBlue}" stroke-width="2" /><circle cx="${itemX}" cy="${itemY - 6}" r="7" fill="${palette.rose}" /><text x="${itemX + 18}" y="${itemY}" fill="${palette.white}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="1">${label}</text>`
    }).join('')}`
}

function economicsFlow(x, y, width, height) {
  const center = x + width / 2
  const boxWidth = Math.min(210, width - 80)
  const startY = y + 55
  const spacing = Math.max(64, (height - 250) / 3)
  const labels = ['TASK', 'PROCESS', 'VALUE']
  return `
    <text x="${center}" y="${y + 24}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2">WORK BEFORE PRICE</text>
    ${labels.map((label, index) => {
      const itemY = startY + index * spacing
      return `<rect x="${center - boxWidth / 2}" y="${itemY}" width="${boxWidth}" height="45" rx="4" fill="${index === 1 ? palette.rose : palette.navy}" stroke="${palette.white}" stroke-width="2" /><text x="${center}" y="${itemY + 29}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">${label}</text>${index < 2 ? `<line x1="${center}" y1="${itemY + 45}" x2="${center}" y2="${itemY + spacing}" stroke="${palette.white}" stroke-width="2" />` : ''}`
    }).join('')}
    <circle cx="${center}" cy="${y + height - 76}" r="53" fill="${palette.navy}" stroke="${palette.rose}" stroke-width="8" />
    <line x1="${center}" y1="${y + height - 76}" x2="${center}" y2="${y + height - 109}" stroke="${palette.white}" stroke-width="4" />
    <line x1="${center}" y1="${y + height - 76}" x2="${center + 27}" y2="${y + height - 62}" stroke="${palette.white}" stroke-width="4" />` 
}

function leadershipHub(x, y, width, height) {
  const centerX = x + width / 2
  const centerY = y + height / 2 + 10
  const radiusX = Math.min(width * 0.38, 145)
  const radiusY = Math.min(height * 0.34, 150)
  const labels = ['STRATEGY', 'GOVERN', 'VENDORS', 'PILOTS', 'ADOPTION', 'CAPABILITY']
  const nodes = labels.map((label, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 3
    const nodeX = centerX + Math.cos(angle) * radiusX
    const nodeY = centerY + Math.sin(angle) * radiusY
    return `<line x1="${centerX}" y1="${centerY}" x2="${nodeX}" y2="${nodeY}" stroke="${palette.paleBlue}" stroke-width="2" /><circle cx="${nodeX}" cy="${nodeY}" r="28" fill="${palette.navy}" stroke="${palette.white}" stroke-width="2" /><text x="${nodeX}" y="${nodeY + 4}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="700" letter-spacing="0.4">${label}</text>`
  }).join('')
  return `
    <text x="${centerX}" y="${y + 24}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2">ONE ACCOUNTABLE OWNER</text>
    ${nodes}
    <circle cx="${centerX}" cy="${centerY}" r="57" fill="${palette.rose}" stroke="${palette.white}" stroke-width="3" />
    <text x="${centerX}" y="${centerY - 4}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="1">AI</text>
    <text x="${centerX}" y="${centerY + 15}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="1">LEADER</text>`
}

function hiddenNetwork(x, y, width, height) {
  const centerX = x + width * 0.63
  const centerY = y + height * 0.58
  const nodes = [
    [0, -95], [84, -48], [92, 48], [0, 100], [-85, 50], [-78, -48],
  ]
  return `
    <text x="${x + width / 2}" y="${y + 24}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2">FROM ONE TO MANY</text>
    <circle cx="${x + 56}" cy="${centerY}" r="15" fill="${palette.rose}" />
    <text x="${x + 56}" y="${centerY + 37}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700">HIDDEN</text>
    <line x1="${x + 76}" y1="${centerY}" x2="${centerX - 45}" y2="${centerY}" stroke="${palette.white}" stroke-width="3" stroke-dasharray="7 7" />
    <path d="M ${centerX - 54} ${centerY - 7} L ${centerX - 45} ${centerY} L ${centerX - 54} ${centerY + 7}" fill="none" stroke="${palette.white}" stroke-width="3" />
    ${nodes.map(([dx, dy]) => `<line x1="${centerX}" y1="${centerY}" x2="${centerX + dx}" y2="${centerY + dy}" stroke="${palette.paleBlue}" stroke-width="2" /><circle cx="${centerX + dx}" cy="${centerY + dy}" r="13" fill="${palette.navy}" stroke="${palette.white}" stroke-width="2" />`).join('')}
    <circle cx="${centerX}" cy="${centerY}" r="35" fill="${palette.rose}" stroke="${palette.white}" stroke-width="3" />
    <text x="${centerX}" y="${centerY + 5}" fill="${palette.white}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700">SHARED</text>`
}

const motifRenderers = {
  'privilege-flow': privilegeFlow,
  'policy-path': policyPath,
  'economics-flow': economicsFlow,
  'leadership-hub': leadershipHub,
  'hidden-network': hiddenNetwork,
}

function cardSvg(article, width, height) {
  const landscape = width / height > 1.5
  const panel = landscape
    ? { x: Math.round(width * 0.7), y: 0, width: Math.round(width * 0.3), height }
    : { x: 0, y: Math.round(height * 0.58), width, height: Math.round(height * 0.42) }
  const copyWidth = landscape ? panel.x - 135 : width - 150
  const fontSize = landscape ? 58 : height > 1000 ? 74 : 66
  const maxCharacters = landscape ? 23 : 27
  const lines = wrapHeadline(article.title, maxCharacters)
  const titleY = landscape ? 230 : 245
  const lineHeight = Math.round(fontSize * 1.08)
  const motif = motifRenderers[article.image.motif]
  if (!motif) throw new Error(`${article.slug}: unsupported image motif ${article.image.motif}`)

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${palette.navy}" />
    <rect width="18" height="${height}" fill="${palette.rose}" />
    <rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" fill="${palette.blue}" />
    <text x="76" y="88" fill="${palette.white}" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700">caio<tspan fill="${palette.rose}">.legal</tspan></text>
    <text x="76" y="154" fill="${palette.paleBlue}" font-family="Courier New, monospace" font-size="16" letter-spacing="3">${escapeXml(article.type.toUpperCase())} · BRIEFING</text>
    ${textLines(lines, 76, titleY, fontSize, lineHeight)}
    <text x="76" y="${landscape ? height - 54 : panel.y - 42}" fill="${palette.paleBlue}" font-family="Courier New, monospace" font-size="15" letter-spacing="2">KEN ERWIN · AI LEADERSHIP FOR LAW FIRMS</text>
    ${motif(panel.x + 18, panel.y + 42, panel.width - 36, panel.height - 84)}
    <rect x="${copyWidth + 92}" y="${height - 22}" width="36" height="5" fill="${palette.rose}" />
  </svg>`
}

async function loadArticles() {
  const files = (await readdir(articleRoot)).filter((file) => file.endsWith('.md')).sort()
  return Promise.all(files.map(async (file) => {
    const markdown = await readFile(resolve(articleRoot, file), 'utf8')
    const match = markdown.match(frontMatterPattern)
    if (!match) throw new Error(`${file}: missing front matter`)
    const article = parse(match[1])
    if (!article?.slug || !article?.title || !article?.type || !article?.image?.base || !article?.image?.motif) {
      throw new Error(`${file}: incomplete article image metadata`)
    }
    return article
  }))
}

await mkdir(outputRoot, { recursive: true })

for (const article of await loadArticles()) {
  const variants = [
    { width: 1200, height: 630 },
    { width: 1200, height: 900 },
    { width: 1200, height: 1200 },
  ]

  for (const { width, height } of variants) {
    const svg = Buffer.from(cardSvg(article, width, height))
    const base = resolve(outputRoot, `${article.slug}-${width}x${height}`)
    await sharp(svg).png({ compressionLevel: 9, palette: true }).toFile(`${base}.png`)

    if (width === 1200 && height === 630) {
      await sharp(svg).webp({ quality: 86 }).toFile(`${base}.webp`)
      await sharp(svg).avif({ quality: 62, effort: 5 }).toFile(`${base}.avif`)
    }
  }
}

console.log('Generated article preview images from Markdown metadata.')
