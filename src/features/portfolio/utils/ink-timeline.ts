export const INK_DURATION = 12
export const OUTLINE_END = 3
export const SHADING_END = 8
export const COLOR_END = 11

export type InkPhase = 'outline' | 'shading' | 'color' | 'photo' | 'complete'
export type InkStrokeTiming = {
  start: number
  end: number
  length: number
}

export function createInkTimeline (lengths: readonly number[], start = 0, end = OUTLINE_END): InkStrokeTiming[] {
  const duration = end - start
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(duration) || duration <= 0) {
    throw new Error('Timeline bounds must have a finite positive span')
  }
  if (lengths.length === 0 || lengths.some(length => !Number.isFinite(length) || length <= 0)) {
    throw new Error('Sketch paths must have a finite positive length')
  }
  const total = lengths.reduce((sum, length) => sum + length, 0)
  if (!Number.isFinite(total)) throw new Error('Sketch length exceeds the supported range')
  const gap = Math.min(0.025, duration / (lengths.length * 4))
  const drawingTime = duration - gap * (lengths.length - 1)
  let cursor = start
  return lengths.map((length, index) => {
    const strokeStart = cursor
    const strokeEnd = index === lengths.length - 1 ? end : strokeStart + drawingTime * length / total
    cursor = strokeEnd + gap
    return { start: strokeStart, end: strokeEnd, length }
  })
}

export function getInkPhase (time: number): InkPhase {
  if (time < OUTLINE_END) return 'outline'
  if (time < SHADING_END) return 'shading'
  if (time < COLOR_END) return 'color'
  if (time < INK_DURATION) return 'photo'
  return 'complete'
}

export function getStrokeProgress (time: number, timing: InkStrokeTiming): number {
  return Math.min(1, Math.max(0, (time - timing.start) / (timing.end - timing.start)))
}

export function getActiveInkStroke (time: number, timings: readonly InkStrokeTiming[]) {
  const index = timings.findIndex(timing => time >= timing.start && time < timing.end)
  if (index < 0) return null
  const timing = timings[index]
  return { index, progress: getStrokeProgress(time, timing), length: timing.length }
}
