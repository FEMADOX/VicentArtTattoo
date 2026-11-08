import type { InkFillPattern } from './ink-fill-paths'
import type { TattooImage, TattooViewSequence } from './ink-views'

type VideoManifest = {
  id: string
  source: string
  width: number
  height: number
  referenceIndex: number
  frames: Array<{ small: string, large: string, width: number, height: number }>
}

type Drawing = {
  title: string
  alt: string
  paths: string[]
  fill: InkFillPattern
}

type VideoStudy = {
  id: string
  source: string
  image: TattooImage
  sequence: TattooViewSequence
} & Drawing

const manifests: Partial<Record<string, VideoManifest>> = import.meta.glob<VideoManifest>('../assets/ink-views/*/manifest.json', { eager: true, import: 'default' })
const drawings = import.meta.glob<Drawing>('../assets/ink-views/*/drawing.json', { eager: true, import: 'default' })
const images = import.meta.glob<string>('../assets/ink-views/*/**/*.webp', { eager: true, query: '?url', import: 'default' })
const sizes = '(max-width: 720px) calc(100vw - 3rem), (max-width: 1280px) calc((100vw - 6rem) / 2), 608px'

export const videoStudies: VideoStudy[] = Object.entries(drawings).flatMap(([path, drawing]) => {
  const directory = path.slice(0, path.lastIndexOf('/') + 1)
  const manifest = manifests[directory + 'manifest.json']
  if (!manifest) return []
  const frames = manifest.frames.map(frame => {
    const small = images[directory + frame.small] ?? ''
    const large = images[directory + frame.large] ?? ''
    return {
      src: large,
      ...(small && large && frame.width > 480 ? { srcSet: small + ' 480w, ' + large + ' ' + frame.width + 'w' } : {}),
      width: frame.width,
      height: frame.height
    }
  })
  const reference = frames.at(manifest.referenceIndex)
  if (!reference?.src) return []
  return [{
    ...drawing,
    id: manifest.id,
    source: manifest.source,
    image: { ...reference, alt: drawing.alt, sizes },
    sequence: { referenceIndex: manifest.referenceIndex, frames }
  }]
})
