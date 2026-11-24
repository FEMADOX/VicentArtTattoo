import { describe, expect, it } from 'vite-plus/test'
import { legacyHref, legacyRoutes, resolveSiteRoute } from '../../../src/app/routes'

describe('selected website routes', () => {
  it('serves the public site at the root', () => {
    expect(resolveSiteRoute('/')).toEqual({ type: 'home' })
  })

  it.each(['/designs/ink-study', '/designs/ink-study/'])('shows not found for the removed ink study route %s', path => {
    expect(resolveSiteRoute(path)).toEqual({ type: 'not-found' })
  })

  it.each(legacyRoutes)('migrates %s to the selected website', (path, section) => {
    expect(resolveSiteRoute(path)).toEqual({ type: 'redirect', section })
    expect(resolveSiteRoute(path + '/')).toEqual({ type: 'redirect', section })
    expect(legacyHref(section)).toBe('/' + (section ? '#' + section : ''))
  })

  it('preserves campaign parameters and existing section links', () => {
    expect(legacyHref('about', '?source=shared', '#booking')).toBe('/?source=shared#booking')
    expect(legacyHref('portfolio', '?source=shared')).toBe('/?source=shared#portfolio')
    expect(legacyHref('', '', '#contact')).toBe('/#contact')
  })

  it.each(['/other', '/designs/d', '/designs/c/about/extra', '/designs/a/portfolio', '/designs/ink-study/extra'])('does not treat %s as a valid page', path => {
    expect(resolveSiteRoute(path)).toEqual({ type: 'not-found' })
  })
})
