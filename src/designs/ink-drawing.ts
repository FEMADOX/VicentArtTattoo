import type { InkFillPattern } from './ink-fill-paths'

export type TattooImage = {
  src: string
  alt: string
  width: number
  height: number
}

export type TattooDrawingData = {
  paths: readonly string[]
  fill: InkFillPattern
}

export function parseTattooDrawing (value: unknown): TattooDrawingData {
  if (!isRecord(value) || !validPaths(value.paths) || !validFill(value.fill)) throw new Error('Invalid drawing data')
  return { paths: value.paths, fill: value.fill }
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function validPaths (value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(item => typeof item === 'string' && item.trim().length > 0)
}

function validFill (value: unknown): value is InkFillPattern {
  if (!isRecord(value)) return false
  return typeof value.region === 'string' && value.region.trim().length > 0 && validPaths(value.paths) && typeof value.strokeWidth === 'number' && Number.isFinite(value.strokeWidth) && value.strokeWidth > 0
}
