import { describe, expect, it } from 'vite-plus/test'
import { editTiming } from '../../scripts/tattoo-video/prepare'

describe('tattoo video editorial timing', () => {
  it('declares each join at an exact frame while preserving reversed section duration', () => {
    expect(editTiming([
      { start: 11.1, end: 17.6, reverse: true },
      { start: 30, end: 32.5, reverse: false }
    ])).toEqual({ frames: 270, duration: 9, cuts: [6.5] })
  })

  it('rejects empty, backward, non-finite and sub-frame intervals', () => {
    expect(() => editTiming([])).toThrow()
    const intervals: Array<[number, number]> = [[2, 1], [-1, 2], [0, Infinity], [0, 0.01]]
    for (const [start, end] of intervals) {
      expect(() => editTiming([{ start, end, reverse: false }])).toThrow()
    }
  })
})
