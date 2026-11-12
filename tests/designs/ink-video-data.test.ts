import { describe, expect, it } from 'vite-plus/test'
import { parseTattooVideoStudies, tattooVideoStudies } from '../../src/designs/tattoo-video-studies'
import { parseTattooDrawing } from '../../src/designs/ink-drawing'
import { getVideoTime } from '../../src/designs/video-view'
import publicManifestText from '../../public/videos/tattoos/manifest.json?raw'

const drawings = import.meta.glob('../../public/videos/tattoos/*-drawing.json', { query: '?raw', import: 'default', eager: true })

describe('prepared footage studies', () => {
  it('keeps bundled and public metadata synchronized', () => {
    expect(parseTattooVideoStudies(JSON.parse(publicManifestText))).toEqual(tattooVideoStudies)
  })
  it('includes the four original pieces with Ghostface first and matching drawing data', () => {
    expect(tattooVideoStudies.map(study => study.id)).toEqual(['ghostface', 'portrait', 'flowers', 'color'])
    for (const study of tattooVideoStudies) {
      expect(study.video.sources.map(source => source.width)).toEqual([480, 720])
      expect(getVideoTime(0, study.video)).toBe(study.video.referenceTime)
      const raw = drawings['../../public' + study.drawingUrl]
      expect(typeof raw).toBe('string')
      if (typeof raw !== 'string') throw new Error('Missing prepared drawing')
      expect(parseTattooDrawing(JSON.parse(raw)).paths.length).toBeGreaterThan(0)
    }
  })

  it('rejects malformed or duplicate study definitions', () => {
    const study = tattooVideoStudies[0]
    for (const value of [null, {}, { version: 2, studies: [study] }, { version: 1, studies: [] }, { version: 1, studies: [study, study] }]) {
      expect(() => parseTattooVideoStudies(value)).toThrow()
    }
  })

  it('rejects a poster whose proportions do not match its footage', () => {
    const study = tattooVideoStudies[0]
    expect(() => parseTattooVideoStudies({ version: 1, studies: [{ ...study, image: { ...study.image, width: 1280, height: 720 } }] })).toThrow()
  })

  it('rejects broken media before a viewer can mount', () => {
    const study = tattooVideoStudies[0]
    for (const video of [null, { ...study.video, referenceTime: Number.NaN }, { ...study.video, sources: [] }]) {
      expect(() => parseTattooVideoStudies({ version: 1, studies: [{ ...study, video }] })).toThrow()
    }
  })
})
