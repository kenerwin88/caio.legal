import { createRoot, hydrateRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { App } from './app'
import './styles.css'

document.documentElement.classList.replace('no-js', 'js')

declare global {
  var __caioRoot: Root | undefined
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Unable to start caio.legal: missing #root element')
const app = <App pathname={window.location.pathname} />
let root = globalThis.__caioRoot

if (root) {
  root.render(app)
} else if (rootElement.hasChildNodes()) {
  root = hydrateRoot(rootElement, app)
} else {
  root = createRoot(rootElement)
  root.render(app)
}

if (import.meta.hot) globalThis.__caioRoot = root
