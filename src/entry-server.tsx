import { renderToString } from 'react-dom/server'
import { App, routeMetadata } from './app'

export { routeMetadata }

export function render(pathname: string) {
  return renderToString(<App pathname={pathname} />)
}
