import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefCallback } from 'react'
import { animate, useMotionValue, useMotionValueEvent } from 'motion/react'
import type { InkFillPattern } from '../../utils/ink-drawing'
import type { TattooImage } from '../../utils/ink-views'
import { COLOR_END, createInkTimeline, getActiveInkStroke, getInkPhase, INK_DURATION, OUTLINE_END, SHADING_END } from '../../utils/ink-timeline'
import type { InkPhase, InkStrokeTiming } from '../../utils/ink-timeline'

type InkPlaybackOptions = {
  enabled: boolean
  inView: boolean
  initialComplete?: boolean | undefined
  image: TattooImage
  paths: readonly string[]
  fill: InkFillPattern
  speed: number
  onAnimationStart?: (() => void) | undefined
}

function useInkPlayback ({ enabled, inView, initialComplete = false, image, paths, fill, speed, onAnimationStart }: InkPlaybackOptions) {
  const imageRef = useRef<HTMLImageElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const needleRef = useRef<SVGGElement>(null)
  const geometryRef = useRef<SVGPathElement[]>([])
  const timingsRef = useRef<InkStrokeTiming[]>([])
  const animationRef = useRef<{ stop: () => void, speed: number } | null>(null)
  const animationStartRef = useRef(onAnimationStart)
  const startedRef = useRef(initialComplete)
  const initialTime = enabled && !initialComplete ? 0 : INK_DURATION
  const clock = useMotionValue(initialTime)
  const playback = useMotionValue<'waiting' | 'playing' | 'complete'>(initialTime === 0 ? 'waiting' : 'complete')
  const phaseValue = useMotionValue<InkPhase>(getInkPhase(initialTime))
  const [timings, setTimings] = useState<InkStrokeTiming[]>([])
  const [ready, setReady] = useState(false)
  const [failure, setFailure] = useState<Error | null>(null)

  useEffect(() => {
    animationStartRef.current = onAnimationStart
  }, [onAnimationStart])

  useEffect(() => {
    if (animationRef.current) animationRef.current.speed = speed
  }, [speed])

  const finish = useCallback(() => {
    animationRef.current?.stop()
    animationRef.current = null
    if (!startedRef.current) animationStartRef.current?.()
    startedRef.current = true
    clock.set(INK_DURATION)
    playback.set('complete')
  }, [clock, playback])

  const play = useCallback(() => {
    if (!enabled || !ready || failure) return
    animationRef.current?.stop()
    startedRef.current = true
    animationStartRef.current?.()
    clock.set(0)
    playback.set('playing')
    animationRef.current = animate(clock, INK_DURATION, {
      duration: INK_DURATION,
      ease: 'linear',
      onComplete: () => {
        animationRef.current = null
        playback.set('complete')
      }
    })
    animationRef.current.speed = speed
  }, [clock, enabled, failure, playback, ready, speed])

  useEffect(() => {
    if (!enabled) finish()
    else if (ready && inView && !startedRef.current) play()
  }, [enabled, finish, inView, play, ready])

  useMotionValueEvent(clock, 'change', time => {
    phaseValue.set(getInkPhase(time))
    const active = getActiveInkStroke(time, timingsRef.current)
    const path = active ? geometryRef.current[active.index] : undefined
    const needle = needleRef.current
    if (!needle) return
    if (!active || !path) {
      needle.style.opacity = '0'
      return
    }
    const distance = active.progress * active.length
    const point = path.getPointAtLength(distance)
    const next = path.getPointAtLength(Math.min(active.length, distance + 1))
    const angle = Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI
    needle.setAttribute('transform', 'translate(' + point.x + ' ' + point.y + ') rotate(' + angle + ')')
    needle.dataset.stroke = String(active.index)
    needle.dataset.distance = String(distance)
    needle.dataset.pass = path.dataset.inkStroke
    needle.style.opacity = '1'
  })

  useEffect(() => {
    const abortController = new AbortController()
    const { signal } = abortController
    const photo = imageRef.current
    const svg = svgRef.current

    async function prepare () {
      try {
        if (!photo || !svg) throw new Error('Drawing frame is unavailable')
        await photo.decode()
        if (signal.aborted) return
        if (!Number.isFinite(fill.strokeWidth) || fill.strokeWidth <= 0) throw new Error('Invalid fill width')
        const region = svg.querySelector<SVGPathElement>('[data-ink-region]')
        if (!region || region.getTotalLength() <= 0) throw new Error('Tattoo region is unavailable')
        const outlines = Array.from(svg.querySelectorAll<SVGPathElement>('[data-ink-stroke="outline"]'))
        const shading = Array.from(svg.querySelectorAll<SVGPathElement>('[data-ink-stroke="shading"]'))
        const color = Array.from(svg.querySelectorAll<SVGPathElement>('[data-ink-stroke="color"]'))
        const geometry = [...outlines, ...shading, ...color]
        const lengths = (strokes: SVGPathElement[]) => strokes.map(path => path.getTotalLength())
        const nextTimings = [
          ...createInkTimeline(lengths(outlines)),
          ...createInkTimeline(lengths(shading), OUTLINE_END, SHADING_END),
          ...createInkTimeline(lengths(color), SHADING_END, COLOR_END)
        ]
        geometryRef.current = geometry
        timingsRef.current = nextTimings
        setTimings(nextTimings)
        setReady(true)
      } catch (error) {
        if (signal.aborted) return
        setFailure(new Error('Unable to prepare the sketch', { cause: error }))
        finish()
      }
    }

    void prepare()
    return () => {
      abortController.abort()
      animationRef.current?.stop()
      animationRef.current = null
    }
  }, [image.src, paths, fill, finish])

  const setImageRef: RefCallback<HTMLImageElement> = useCallback(element => {
    imageRef.current = element
  }, [])
  const setSvgRef: RefCallback<SVGSVGElement> = useCallback(element => {
    svgRef.current = element
  }, [])
  const setNeedleRef: RefCallback<SVGGElement> = useCallback(element => {
    needleRef.current = element
  }, [])

  return { clock, playback, phaseValue, timings, ready, failure, imageRef: setImageRef, svgRef: setSvgRef, needleRef: setNeedleRef, finish, play }
}

export default useInkPlayback
