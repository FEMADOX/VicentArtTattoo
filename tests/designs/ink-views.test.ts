import { describe, expect, it } from 'vite-plus/test'
import { getViewIndex, validateTattooSequence } from '../../src/designs/ink-views'
import type {
  TattooImage,
  TattooViewFrame,
  TattooViewSequence
} from '../../src/designs/ink-views'

const image: TattooImage = {
  src: '/original.webp',
  alt: 'Original tattoo photograph',
  width: 1200,
  height: 1600
}
const original: TattooViewFrame = { ...image }
const alternate: TattooViewFrame = { ...original, src: '/alternate.webp' }
const sequence: TattooViewSequence = {
  referenceIndex: 1,
  frames: [alternate, original]
}

describe('tattoo view sequence validation', () => {
  it('accepts the original photograph at any valid reference index', () => {
    expect(validateTattooSequence(image, sequence)).toBeNull()
    expect(validateTattooSequence(image, {
      referenceIndex: 0,
      frames: [original, alternate]
    })).toBeNull()
  })

  it('accepts the maximum sequence size', () => {
    expect(validateTattooSequence(image, {
      referenceIndex: 0,
      frames: [original, ...Array.from({ length: 31 }, () => alternate)]
    })).toBeNull()
  })

  it.each([0, 1, 33])('rejects %s frames', count => {
    expect(validateTattooSequence(image, {
      referenceIndex: 0,
      frames: Array.from({ length: count }, () => original)
    })).toMatch(/between 2 and 32/)
  })

  it.each([-1, 2, 0.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects reference index %s',
    referenceIndex => {
      expect(validateTattooSequence(image, {
        ...sequence, referenceIndex
      })).toMatch(/index/)
    }
  )

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid original dimensions %s',
    dimension => {
      expect(validateTattooSequence({ ...image, width: dimension }, sequence))
        .toMatch(/invalid image details/)
      expect(validateTattooSequence({ ...image, height: dimension }, sequence))
        .toMatch(/invalid image details/)
    }
  )

  it.each([
    { ...alternate, width: 600 },
    { ...alternate, height: 0 },
    { ...alternate, width: Number.NaN },
    { ...alternate, height: Number.POSITIVE_INFINITY }
  ])('rejects a mismatched frame $width by $height', frame => {
    expect(validateTattooSequence(image, {
      ...sequence, frames: [frame, original]
    })).toMatch(/dimensions/)
  })

  it.each([
    { ...alternate, src: '' },
    { ...alternate, src: '  ' },
    { ...alternate, srcSet: '' },
    { ...alternate, srcSet: '  ' }
  ])('rejects empty image URLs', frame => {
    expect(validateTattooSequence(image, {
      ...sequence, frames: [frame, original]
    })).toMatch(/non-empty image URL/)
  })

  it('requires the exact original photograph as the reference', () => {
    expect(validateTattooSequence(image, {
      ...sequence, frames: [original, alternate]
    })).toMatch(/original photograph/)
  })

  it('requires the same responsive photograph, even when the fallback URL matches', () => {
    const responsiveImage = { ...image, srcSet: '/original-small.webp 600w' }
    expect(validateTattooSequence(responsiveImage, sequence))
      .toMatch(/original photograph/)
    expect(validateTattooSequence(responsiveImage, {
      ...sequence,
      frames: [alternate, { ...original, srcSet: '/different-small.webp 600w' }]
    })).toMatch(/original photograph/)
    expect(validateTattooSequence(responsiveImage, {
      ...sequence,
      frames: [alternate, { ...original, srcSet: responsiveImage.srcSet }]
    })).toBeNull()
    expect(validateTattooSequence(image, {
      ...sequence,
      frames: [alternate, { ...original, srcSet: responsiveImage.srcSet }]
    })).toMatch(/original photograph/)
  })

  it('rejects an empty base photograph URL', () => {
    expect(validateTattooSequence({ ...image, src: ' ' }, sequence))
      .toMatch(/invalid image details/)
  })
})

describe('tattoo pointer view index', () => {
  it.each([
    [-100, 100, 5, 0],
    [0, 100, 5, 0],
    [19.999, 100, 5, 0],
    [20, 100, 5, 1],
    [50, 100, 5, 2],
    [99.999, 100, 5, 4],
    [100, 100, 5, 4],
    [1000, 100, 5, 4],
    [Number.MAX_VALUE, Number.MIN_VALUE, 5, 4],
    [50, 100, 1, 0]
  ])('maps x=%s width=%s count=%s to %s', (x, width, count, expected) => {
    expect(getViewIndex(x, width, count)).toBe(expected)
  })

  it.each([
    [Number.NaN, 100, 5],
    [Number.POSITIVE_INFINITY, 100, 5],
    [Number.NEGATIVE_INFINITY, 100, 5],
    [50, 0, 5],
    [50, -1, 5],
    [50, Number.NaN, 5],
    [50, Number.POSITIVE_INFINITY, 5],
    [50, 100, 0],
    [50, 100, -1],
    [50, 100, 2.5],
    [50, 100, Number.NaN],
    [50, 100, Number.POSITIVE_INFINITY],
    [50, 100, Number.MAX_SAFE_INTEGER + 1]
  ])('safely handles invalid x=%s width=%s count=%s', (x, width, count) => {
    expect(getViewIndex(x, width, count)).toBe(0)
  })
})
