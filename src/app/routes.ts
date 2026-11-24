export type SiteRoute =
  | { type: 'home' } |
  { type: 'redirect', section: string } |
  { type: 'not-found' }

export const legacyRoutes = [
  ['/designs', ''],
  ['/designs/a', ''],
  ['/designs/b', ''],
  ['/designs/c', ''],
  ['/designs/c/portfolio', 'portfolio'],
  ['/designs/c/about', 'about'],
  ['/designs/c/contact', 'contact']
] as const

export function resolveSiteRoute (pathname: string): SiteRoute {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return { type: 'home' }
  for (const [legacyPath, section] of legacyRoutes) {
    if (path === legacyPath) return { type: 'redirect', section }
  }
  return { type: 'not-found' }
}

export function legacyHref (section: string, search = '', hash = '') {
  return '/' + search + (hash || (section ? '#' + section : ''))
}
