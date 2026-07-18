import { renderToString } from 'react-dom/server'
import { App } from './app'
import { routeMetadata, structuredDataForPath } from './site-data'

export { routeMetadata, structuredDataForPath }

export function render(pathname: string) {
  return renderToString(<App pathname={pathname} />)
}
