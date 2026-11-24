import './global.css'
import SiteApp from './app/SiteApp'
import { legacyHref, resolveSiteRoute } from './app/routes'

const requestedRoute = resolveSiteRoute(window.location.pathname)
const route = requestedRoute.type === 'redirect' ? { type: 'home' as const } : requestedRoute

if (requestedRoute.type === 'redirect') {
  window.history.replaceState(null, '', legacyHref(requestedRoute.section, window.location.search, window.location.hash))
}

const Entry = () => <SiteApp route={route} />

export default Entry
