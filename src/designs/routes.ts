export type DesignRoute =
  | { type: 'home' } |
  { type: 'ink-study' } |
  { type: 'redirect', section: string } |
  { type: 'not-found' }

export const legacyDesignRoutes = [
  ['/designs', ''],
  ['/designs/a', ''],
  ['/designs/b', ''],
  ['/designs/c', ''],
  ['/designs/c/portfolio', 'portfolio'],
  ['/designs/c/about', 'about'],
  ['/designs/c/contact', 'contact']
] as const

export function resolveDesignRoute (pathname: string): DesignRoute {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return { type: 'home' }
  if (path === '/designs/ink-study') return { type: 'ink-study' }
  for (const [legacyPath, section] of legacyDesignRoutes) {
    if (path === legacyPath) return { type: 'redirect', section }
  }
  return { type: 'not-found' }
}

export function legacyDesignHref (section: string, search = '', hash = '') {
  return '/' + search + (hash || (section ? '#' + section : ''))
}
