import { describe, expect, it } from 'vite-plus/test'
import { parseTattooDrawing } from '../../src/designs/ink-drawing'

const valid = {
  paths: ['M0 0 L10 10'],
  fill: { region: 'M0 0 L10 0 L10 10 Z', paths: ['M1 1 L9 9'], strokeWidth: 2 }
}

describe('tattoo drawing data boundary', () => {
  it('accepts nonempty geometry and a finite positive fill width', () => {
    expect(parseTattooDrawing(valid)).toEqual(valid)
    expect(parseTattooDrawing({ ...valid, fill: { ...valid.fill, strokeWidth: Number.MIN_VALUE } }).fill.strokeWidth).toBe(Number.MIN_VALUE)
  })

  it.each([
    ['missing drawing', null],
    ['empty contours', { ...valid, paths: [] }],
    ['nonstring contour', { ...valid, paths: ['M0 0 L1 1', null] }],
    ['blank fill region', { ...valid, fill: { ...valid.fill, region: '   ' } }],
    ['empty fill paths', { ...valid, fill: { ...valid.fill, paths: [] } }],
    ['blank fill path', { ...valid, fill: { ...valid.fill, paths: ['  '] } }]
  ])('rejects %s', (_name, value) => {
    expect(() => parseTattooDrawing(value)).toThrow('Invalid drawing data')
  })

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, '2'])('rejects invalid fill width: %s', strokeWidth => {
    expect(() => parseTattooDrawing({ ...valid, fill: { ...valid.fill, strokeWidth } })).toThrow('Invalid drawing data')
  })
})
