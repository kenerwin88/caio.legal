const normalizedPathPattern = /^\/(?:[a-z0-9-]+)(?:\/[a-z0-9-]+)*$/

export function escapeHtmlText(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export function escapeHtmlAttribute(value) {
  return escapeHtmlText(value)
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function escapeXml(value) {
  return escapeHtmlText(value)
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function outputFileForPath(pathname) {
  if (pathname === '/') return 'index.html'
  if (!normalizedPathPattern.test(pathname)) {
    throw new Error(`Expected a normalized site pathname, received: ${pathname}`)
  }
  if (pathname === '/404') return '404.html'
  return `${pathname.slice(1)}.html`
}
