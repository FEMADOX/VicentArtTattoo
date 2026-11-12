import vercelConfig from '../../vercel.json?raw'
import { describe, expect, it } from 'vite-plus/test'
import { legacyDesignHref, legacyDesignRoutes, resolveDesignRoute } from '../../src/designs/routes'

describe('selected website routes', () => {
  it('shows design A at the public root', () => {
    expect(resolveDesignRoute('/')).toEqual({ type: 'home' })
  })

  it('redirects the retired ink study to the portfolio with a trailing slash', () => {
    expect(resolveDesignRoute('/designs/ink-study')).toEqual({ type: 'redirect', section: 'portfolio' })
    expect(resolveDesignRoute('/designs/ink-study/')).toEqual({ type: 'redirect', section: 'portfolio' })
  })

  it.each(legacyDesignRoutes)('migrates %s to the selected website', (path, section) => {
    expect(resolveDesignRoute(path)).toEqual({ type: 'redirect', section })
    expect(resolveDesignRoute(path + '/')).toEqual({ type: 'redirect', section })
    expect(legacyDesignHref(section)).toBe('/' + (section ? '#' + section : ''))
  })

  it('preserves campaign parameters and existing section links', () => {
    expect(legacyDesignHref('about', '?source=shared', '#booking')).toBe('/?source=shared#booking')
    expect(legacyDesignHref('portfolio', '?source=shared')).toBe('/?source=shared#portfolio')
    expect(legacyDesignHref('', '', '#contact')).toBe('/#contact')
  })

  it.each(['/other', '/designs/d', '/designs/c/about/extra', '/designs/a/portfolio', '/designs/ink-study/extra'])('does not treat %s as a valid page', path => {
    expect(resolveDesignRoute(path)).toEqual({ type: 'not-found' })
  })

  it('only redirects retired base routes at the hosting layer', () => {
    const config: unknown = JSON.parse(vercelConfig)
    expect(config).toEqual({
      $schema: 'https://openapi.vercel.sh/vercel.json',
      redirects: legacyDesignRoutes.filter(([, section]) => !section).map(([source]) => ({ source, destination: '/', permanent: true })),
      rewrites: [{ source: '/designs/:path*', destination: '/index.html' }]
    })
  })
})
