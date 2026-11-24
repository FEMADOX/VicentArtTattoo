import vercelConfig from '../../../vercel.json?raw'
import { describe, expect, it } from 'vite-plus/test'
import { legacyRoutes } from '../../../src/app/routes'

describe('hosting route configuration', () => {
  it('only redirects retired base routes at the hosting layer', () => {
    const config: unknown = JSON.parse(vercelConfig)
    expect(config).toEqual({
      $schema: 'https://openapi.vercel.sh/vercel.json',
      buildCommand: 'pnpm exec vpr build',
      redirects: legacyRoutes.filter(([, section]) => !section).map(([source]) => ({ source, destination: '/', permanent: true })),
      rewrites: [{ source: '/designs/:path*', destination: '/index.html' }]
    })
  })
})
