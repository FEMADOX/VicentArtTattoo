import { describe, expect, it } from 'vite-plus/test'
import { portfolioWorks } from '../../../src/features/portfolio/data/portfolio-works'

describe('public portfolio works', () => {
  it('keeps the eight photo identifiers and places the four recordings after the selected four', () => {
    expect(portfolioWorks.map(work => work.id)).toEqual([1, 9, 10, 7, 2, 3, 4, 5, 6, 8, 11, 12])
    expect(new Set(portfolioWorks.map(work => work.id)).size).toBe(12)
    expect(portfolioWorks.slice(0, 4).map(work => work.title ?? work.id)).toEqual([1, 'Ghostface', 'Portrait', 7])
  })

  it('gives the four recorded pieces their local footage and drawing data', () => {
    const recordings = portfolioWorks.filter(work => work.video)
    expect(recordings.map(work => work.title)).toEqual(['Ghostface', 'Portrait', 'Flowers', 'Color sleeve'])
    for (const work of recordings) {
      expect(work.video?.sources).toHaveLength(2)
      expect(work.drawingUrl).toMatch(/^\/videos\/tattoos\/.+-drawing\.json$/)
    }
  })

  it('provides drawing data for every work in gallery order', () => {
    expect(portfolioWorks.map(work => work.drawingUrl)).toEqual([
      '/drawings/tattoos/portfolio1-drawing.json',
      '/videos/tattoos/ghostface-drawing.json',
      '/videos/tattoos/portrait-drawing.json',
      '/drawings/tattoos/portfolio7-drawing.json',
      '/drawings/tattoos/portfolio2-drawing.json',
      '/drawings/tattoos/portfolio3-drawing.json',
      '/drawings/tattoos/portfolio4-drawing.json',
      '/drawings/tattoos/portfolio5-drawing.json',
      '/drawings/tattoos/portfolio6-drawing.json',
      '/drawings/tattoos/portfolio8-drawing.json',
      '/videos/tattoos/flowers-drawing.json',
      '/videos/tattoos/color-drawing.json'
    ])
  })
})
