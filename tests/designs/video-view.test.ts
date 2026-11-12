import { describe, expect, it } from 'vite-plus/test'
import { clampVideoPosition, crossesVideoCut, getPointerVideoPosition, getVideoPositionText, getVideoTime, isTattooVideoConfig, type TattooVideoConfig } from '../../src/designs/video-view'

const video: TattooVideoConfig = {
  sources: [{ src: '/videos/tattoos/example.mp4', width: 720, height: 1280 }],
  duration: 10,
  referenceTime: 4,
  fps: 30,
  cuts: [2, 6]
}

describe('footage viewing position', () => {
  it('uses the chosen front rather than the temporal midpoint', () => {
    expect(getVideoTime(0, video)).toBe(4)
    expect(getVideoTime(-100, video)).toBe(0)
    expect(getVideoTime(100, video)).toBeCloseTo(10 - 1 / 30)
    expect(getVideoTime(-50, video)).toBe(2)
    expect(getVideoTime(50, video)).toBeCloseTo((4 + 10 - 1 / 30) / 2)
  })

  it('clamps invalid positions and keeps the pointer anchored on entry', () => {
    expect(clampVideoPosition(Number.NaN)).toBe(0)
    expect(clampVideoPosition(180)).toBe(100)
    expect(getPointerVideoPosition(30, 0, 400)).toBe(30)
    expect(getPointerVideoPosition(30, -100, 400)).toBe(-20)
    expect(getPointerVideoPosition(30, 1000, 400)).toBe(100)
    expect(getPointerVideoPosition(30, 100, 0)).toBe(30)
    expect(getPointerVideoPosition(30, Number.NaN, 400)).toBe(30)
    expect(getVideoTime(Number.POSITIVE_INFINITY, video)).toBe(4)
  })

  it('describes positions without implying measured degrees', () => {
    expect(getVideoPositionText(0)).toBe('Front view')
    expect(getVideoPositionText(-100)).toBe('Left view, 100 percent of range')
    expect(getVideoPositionText(50)).toBe('Right view, 50 percent of range')
  })

  it('detects cuts in either direction including their boundary', () => {
    expect(crossesVideoCut(1, 3, video.cuts)).toBe(true)
    expect(crossesVideoCut(3, 1, video.cuts)).toBe(true)
    expect(crossesVideoCut(1, 2, video.cuts)).toBe(true)
    expect(crossesVideoCut(2, 3, video.cuts)).toBe(false)
    expect(crossesVideoCut(2, 2, video.cuts)).toBe(false)
    expect(crossesVideoCut(Number.NaN, 8, video.cuts)).toBe(false)
  })
})

describe('footage config boundary', () => {
  it('accepts consistent variants and rejects unusable timelines or media', () => {
    expect(isTattooVideoConfig(video)).toBe(true)
    expect(isTattooVideoConfig({ ...video, sources: [...video.sources, { src: '/small.mp4', width: 480, height: 854 }] })).toBe(true)
    for (const invalid of [null, {}, { ...video, sources: [] }, { ...video, fps: 0 }, { ...video, referenceTime: 0 }, { ...video, referenceTime: 10 }, { ...video, duration: Number.NaN }, { ...video, cuts: [6, 2] }, { ...video, cuts: [0] }, { ...video, sources: [{ src: '', width: 1, height: 1 }] }, { ...video, sources: [...video.sources, { src: '/bad.mp4', width: 720, height: 720 }] }]) {
      expect(isTattooVideoConfig(invalid)).toBe(false)
    }
  })
})
