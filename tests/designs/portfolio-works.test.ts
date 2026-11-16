import { describe, expect, it } from 'vite-plus/test'
import { portfolioWorks } from '../../src/designs/portfolio-works'

describe('public portfolio works', () => {
  it('groups recorded work before photographs while preserving each group order', () => {
    expect(portfolioWorks.map(work => work.id)).toEqual([1, 9, 10, 2, 3, 4, 5, 6, 7, 8, 11, 12])
    expect(new Set(portfolioWorks.map(work => work.id)).size).toBe(12)
    const movement = portfolioWorks.filter(work => work.video)
    const still = portfolioWorks.filter(work => !work.video)
    expect(movement.map(work => work.title)).toEqual(['Ghostface', 'Portrait', 'Flowers', 'Color sleeve'])
    expect(still.map(work => work.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect([...movement, ...still]).toHaveLength(portfolioWorks.length)
  })

  it('gives the four recorded pieces their local footage and drawing data', () => {
    const recordings = portfolioWorks.filter(work => work.video)
    expect(recordings.map(work => work.title)).toEqual(['Ghostface', 'Portrait', 'Flowers', 'Color sleeve'])
    for (const work of recordings) {
      expect(work.video?.sources).toHaveLength(2)
      expect(work.drawingUrl).toMatch(/^\/videos\/tattoos\/.+-drawing\.json$/)
    }
  })

  it('keeps the hand-authored gorilla and owl drawings', () => {
    expect(portfolioWorks.filter(work => work.drawing).map(work => [work.id, work.drawing])).toEqual([[1, 'gorilla'], [7, 'owl']])
  })

  it('assigns prepared drawings to every public portfolio work', () => {
    expect(portfolioWorks.every(work => work.video || work.drawing || work.drawingUrl)).toBe(true)
    expect(portfolioWorks.filter(work => work.drawingUrl?.startsWith('/drawings/tattoos/')).map(work => work.id)).toEqual([2, 3, 4, 5, 6, 8])
  })
})
