import { lazy, Suspense } from 'react'
import './global.css'
import DesignApp from './designs/DesignApp'
import { CatalogSkeleton } from './components/ContentSkeleton'
import { legacyDesignHref, resolveDesignRoute } from './designs/routes'

const DevCatalog = import.meta.env.DEV ? lazy(async () => await import('./dev/UiCatalog')) : null
const catalogRoute = import.meta.env.DEV && /^\/__ui\/?$/.test(window.location.pathname)
const requestedRoute = resolveDesignRoute(window.location.pathname)
const route = requestedRoute.type === 'redirect' ? { type: 'home' as const } : requestedRoute

if (requestedRoute.type === 'redirect') {
  window.history.replaceState(null, '', legacyDesignHref(requestedRoute.section, window.location.search, window.location.hash))
}

export default function Entry () {
  if (catalogRoute && DevCatalog) return <Suspense fallback={<CatalogSkeleton />}><DevCatalog /></Suspense>
  return <DesignApp route={route} />
}
