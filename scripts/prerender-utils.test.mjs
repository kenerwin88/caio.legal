import assert from 'node:assert/strict'
import test from 'node:test'

import {
  escapeHtmlAttribute,
  escapeHtmlText,
  escapeXml,
  outputFileForPath,
} from './prerender-utils.mjs'

test('escapeHtmlText protects text nodes without over-escaping quotes', () => {
  assert.equal(escapeHtmlText('A&B < C > D "quoted"'), 'A&amp;B &lt; C &gt; D "quoted"')
})

test('escapeHtmlAttribute protects all attribute delimiters', () => {
  assert.equal(
    escapeHtmlAttribute('A&B < C > D "double" \'single\''),
    'A&amp;B &lt; C &gt; D &quot;double&quot; &#39;single&#39;',
  )
})

test('escapeXml protects XML text and attribute delimiters', () => {
  assert.equal(escapeXml('A&B < C > D "double" \'single\''), 'A&amp;B &lt; C &gt; D &quot;double&quot; &apos;single&apos;')
})

test('outputFileForPath maps every supported route shape', () => {
  assert.equal(outputFileForPath('/'), 'index.html')
  assert.equal(outputFileForPath('/404'), '404.html')
  assert.equal(outputFileForPath('/about'), 'about.html')
  assert.equal(outputFileForPath('/notes/example'), 'notes/example.html')
})

test('outputFileForPath rejects unsafe or non-normalized paths', () => {
  for (const pathname of ['', 'about', '/about/', '/../outside', '/notes//example']) {
    assert.throws(() => outputFileForPath(pathname), /normalized site pathname/)
  }
})
