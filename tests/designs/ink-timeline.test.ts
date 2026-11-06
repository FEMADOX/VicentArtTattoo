import { describe, expect, it } from 'vite-plus/test'
import { createInkTimeline, getActiveInkStroke, getInkPhase, getStrokeProgress, COLOR_END, INK_DURATION, OUTLINE_END, SHADING_END } from '../../src/designs/ink-timeline'

describe('ink drawing timeline', () => {
  it('weights each stroke by its length and leaves a hidden travel gap', () => {
    const timings = createInkTimeline([100, 300])
    const first = timings[0]
    const second = timings[1]
    expect(first.start).toBe(0)
    expect(second.end).toBe(OUTLINE_END)
    expect(second.end - second.start).toBeCloseTo(3 * (first.end - first.start))
    expect(second.start - first.end).toBeCloseTo(0.025)
    expect(getActiveInkStroke(first.end + 0.01, timings)).toBeNull()
    expect(getActiveInkStroke(second.start, timings)?.index).toBe(1)
    expect(getActiveInkStroke(OUTLINE_END, timings)).toBeNull()
  })

  it.each([
    ['shading', OUTLINE_END, SHADING_END],
    ['color', SHADING_END, COLOR_END]
  ])('fits %s strokes into its offset phase span', (_phase, start, end) => {
    const timings = createInkTimeline([100, 300], start, end)
    const [first, second] = timings
    expect(first.start).toBe(start)
    expect(second.end).toBe(end)
    expect(second.end - second.start).toBeCloseTo(3 * (first.end - first.start))
    expect(getActiveInkStroke(first.end, timings)).toBeNull()
    expect(getActiveInkStroke(second.start, timings)?.index).toBe(1)
    expect(getActiveInkStroke(end, timings)).toBeNull()
  })

  it('clamps stroke progress at the start and end', () => {
    const timing = { start: 1, end: 2, length: 100 }
    expect(getStrokeProgress(0, timing)).toBe(0)
    expect(getStrokeProgress(1.5, timing)).toBe(0.5)
    expect(getStrokeProgress(3, timing)).toBe(1)
  })

  it.each([
    [0, 'outline'], [OUTLINE_END - 0.001, 'outline'], [OUTLINE_END, 'shading'],
    [SHADING_END - 0.001, 'shading'], [SHADING_END, 'color'],
    [COLOR_END - 0.001, 'color'], [COLOR_END, 'photo'],
    [INK_DURATION - 0.001, 'photo'], [INK_DURATION, 'complete']
  ])('keeps phase transitions continuous at %s seconds', (time, phase) => {
    expect(getInkPhase(time)).toBe(phase)
  })

  it.each([{ lengths: [] }, { lengths: [0] }, { lengths: [-2] }, { lengths: [Number.NaN] }, { lengths: [Number.POSITIVE_INFINITY] }])('rejects invalid sketch geometry $lengths', ({ lengths }) => {
    expect(() => createInkTimeline(lengths)).toThrow()
  })

  it.each([
    { start: Number.NaN, end: 1 },
    { start: 0, end: Number.POSITIVE_INFINITY },
    { start: 2, end: 1 },
    { start: 1, end: 1 },
    { start: -Number.MAX_VALUE, end: Number.MAX_VALUE }
  ])('rejects invalid timeline bounds $start to $end', ({ start, end }) => {
    expect(() => createInkTimeline([1], start, end)).toThrow()
  })

  it('keeps strokes positive even for a long path list', () => {
    const timings = createInkTimeline(Array.from({ length: 200 }, () => 1))
    expect(timings.every(timing => timing.end > timing.start)).toBe(true)
    expect(timings.at(-1)?.end).toBe(OUTLINE_END)
  })
})
