import manifestText from '../assets/tattoo-video-manifest.json?raw'
import type { TattooImage } from './ink-drawing'
import { isTattooVideoConfig } from './video-view'
import type { TattooVideoConfig } from './video-view'

export type TattooVideoStudy = {
  id: string
  label: string
  image: TattooImage
  drawingUrl: string
  video: TattooVideoConfig
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPositiveInteger (value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function isImage (value: unknown): value is TattooImage {
  return isRecord(value) && typeof value.src === 'string' && value.src.startsWith('/videos/tattoos/') &&
    typeof value.alt === 'string' && value.alt.length > 0 && isPositiveInteger(value.width) && isPositiveInteger(value.height)
}

function isStudy (value: unknown): value is TattooVideoStudy {
  if (!isRecord(value) || !isImage(value.image)) return false
  const image = value.image
  return typeof value.id === 'string' && value.id.length > 0 &&
    typeof value.label === 'string' && value.label.length > 0 &&
    typeof value.drawingUrl === 'string' && value.drawingUrl.startsWith('/videos/tattoos/') &&
    isTattooVideoConfig(value.video) &&
    value.video.sources.every(source => Math.abs(source.width / source.height - image.width / image.height) < 0.002)
}

export function parseTattooVideoStudies (value: unknown): readonly TattooVideoStudy[] {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.studies) || value.studies.length === 0 || !value.studies.every(isStudy)) throw new Error('Invalid tattoo video manifest')
  if (new Set(value.studies.map(study => study.id)).size !== value.studies.length) throw new Error('Duplicate tattoo video study')
  return value.studies
}

export const tattooVideoStudies = parseTattooVideoStudies(JSON.parse(manifestText))
