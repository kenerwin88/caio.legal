import { renderToString } from 'react-dom/server'
import { App } from './app'
import { contentManifest, routeMetadata, siteUrl, structuredDataForPath } from './site-data'

export { contentManifest, routeMetadata, siteUrl, structuredDataForPath }

export function render(pathname: string) {
  return renderToString(<App pathname={pathname} />)
}
