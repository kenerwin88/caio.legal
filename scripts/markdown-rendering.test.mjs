import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'markdown-to-jsx'

const options = { disableParsingRawHTML: true }

test('article Markdown renders common formatting into crawlable HTML', () => {
  const html = renderToStaticMarkup(React.createElement(
    Markdown,
    { options },
    '**Important**\n\n- First\n- Second\n\n> A verified quotation.\n>\n> — *Example v. Case*\n\n[Authority](https://example.gov/opinion)',
  ))

  assert.match(html, /<strong>Important<\/strong>/)
  assert.match(html, /<ul><li>First<\/li><li>Second<\/li><\/ul>/)
  assert.match(html, /<blockquote><p>A verified quotation\.<\/p><p>— <em>Example v\. Case<\/em><\/p><\/blockquote>/)
  assert.match(html, /<a href="https:\/\/example\.gov\/opinion">Authority<\/a>/)
})

test('article Markdown does not render raw HTML or unsafe link protocols', () => {
  const html = renderToStaticMarkup(React.createElement(
    Markdown,
    { options },
    '[Unsafe](javascript:alert(1))\n\n<script>alert(2)</script>',
  ))

  assert.doesNotMatch(html, /href=/)
  assert.doesNotMatch(html, /<script>/)
  assert.match(html, /&lt;script&gt;/)
})
