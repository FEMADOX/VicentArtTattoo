type TattooVideoSource = { src: string, width: number, height: number }

export type TattooVideoConfig = {
  sources: readonly TattooVideoSource[]
  referenceTime: number
  duration: number
  fps: number
  cuts: readonly number[]
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPositiveNumber (value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

function isVideoSource (value: unknown): value is TattooVideoSource {
  if (!isRecord(value)) return false
  return typeof value.src === 'string' && value.src.trim().length > 0 && isPositiveNumber(value.width) && isPositiveNumber(value.height)
}

function validSources (value: unknown) {
  if (!Array.isArray(value)) return false
  const sources: readonly unknown[] = value
  if (!sources.length || !sources.every(isVideoSource)) return false
  const ratio = sources[0].width / sources[0].height
  return sources.every(source => Math.abs(source.width / source.height / ratio - 1) <= 0.01)
}

function validCuts (value: unknown, lastTime: number) {
  if (!Array.isArray(value)) return false
  const cuts: readonly unknown[] = value
  let previous = 0
  for (const cut of cuts) {
    if (typeof cut !== 'number' || !Number.isFinite(cut) || cut <= previous || cut >= lastTime) return false
    previous = cut
  }
  return true
}

export function isTattooVideoConfig (value: unknown): value is TattooVideoConfig {
  if (!isRecord(value)) return false
  const { duration, fps, referenceTime } = value
  if (!isPositiveNumber(duration) || !isPositiveNumber(fps) || !isPositiveNumber(referenceTime)) return false
  const lastTime = duration - 1 / fps
  if (referenceTime >= lastTime) return false
  return validSources(value.sources) && validCuts(value.cuts, lastTime)
}

export function clampVideoPosition (position: number) {
  return Number.isFinite(position) ? Math.max(-100, Math.min(100, position)) : 0
}

export function getVideoTime (position: number, config: TattooVideoConfig) {
  if (!isTattooVideoConfig(config)) return 0
  const value = clampVideoPosition(position)
  return value < 0
    ? config.referenceTime * (1 + value / 100)
    : config.referenceTime + value / 100 * (config.duration - 1 / config.fps - config.referenceTime)
}

export function getPointerVideoPosition (start: number, deltaX: number, width: number) {
  if (!Number.isFinite(deltaX) || !Number.isFinite(width) || width <= 0) return clampVideoPosition(start)
  return clampVideoPosition(clampVideoPosition(start) + deltaX / width * 200)
}

export function getVideoPositionText (position: number) {
  const rounded = Math.round(clampVideoPosition(position))
  return rounded === 0 ? 'Front view' : `${rounded < 0 ? 'Left' : 'Right'} view, ${Math.abs(rounded)} percent of range`
}

export function crossesVideoCut (from: number, to: number, cuts: readonly number[]) {
  if (!Number.isFinite(from) || !Number.isFinite(to)) return false
  const first = Math.min(from, to)
  const last = Math.max(from, to)
  return cuts.some(cut => cut > first && cut <= last)
}
