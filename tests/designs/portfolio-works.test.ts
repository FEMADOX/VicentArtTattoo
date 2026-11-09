import { describe, expect, it } from 'vite-plus/test'
import { portfolioWorks } from '../../src/designs/portfolio-works'

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

  it('offers the existing gorilla and owl drawings without adding them to the other photos', () => {
    expect(portfolioWorks.filter(work => work.drawing).map(work => [work.id, work.drawing])).toEqual([[1, 'gorilla'], [7, 'owl']])
  })
})
