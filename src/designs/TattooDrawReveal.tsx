import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { animate, useInView, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import { Maximize2, RotateCcw } from 'lucide-react'
import { DesignDialog } from './components'
import { Button } from '../components/ui/button'
import { Slider } from '../components/ui/slider'
import { useDesignMotion } from './motion'
import { createInkTimeline, getActiveInkStroke, getInkPhase, getStrokeProgress, INK_DURATION, OUTLINE_END, SHADING_END, COLOR_END } from './ink-timeline'
import type { InkPhase, InkStrokeTiming } from './ink-timeline'
import type { InkFillPattern } from './ink-fill-paths'
import { useInkSnapshot } from './useInkSnapshot'

const styles = {
  study: 'group/ink min-w-0',
  frame: 'relative isolate block w-full overflow-hidden border border-border bg-[#f2f2f2] p-0 text-left text-[#171717]',
  original: 'relative z-2 block h-auto w-full group-data-[ink-state=complete]/ink:opacity-100!',
  paper: 'absolute inset-0 z-0 bg-[#f2f2f2]',
  sketch: 'pointer-events-none absolute inset-0 z-3 size-full',
  shading: 'grayscale',
  needle: 'opacity-0',
  inkDepth: 'group-data-[ink-state=complete]/ink:opacity-100!',
  enlarge: 'absolute right-3 bottom-3 z-4 inline-flex min-h-9 items-center gap-2 border border-border bg-background/90 px-[0.7rem] py-2 text-xs/[inherit] text-white',
  status: 'flex min-h-12 items-center justify-between gap-4 text-xs/[inherit] text-body [&>span]:whitespace-nowrap [&>span]:text-muted-foreground',
  controls: 'flex flex-wrap gap-3 [&>button]:flex-1 [@media(width<=390px)]:flex-col',
  speedControl: 'mb-4 flex flex-wrap items-center gap-3 font-mono text-xs text-body [&>span]:whitespace-nowrap [&>span:last-child]:min-w-[4ch] [&>span:last-child]:text-right [&>span:last-child]:tabular-nums'
}

type TattooDrawRevealProps = {
  image: { src: string, alt: string, width: number, height: number }
  paths: readonly string[]
  fill: InkFillPattern
}

const phaseLabels: Record<InkPhase, string> = {
  outline: 'Drawing the contours',
  shading: 'Shading the whole tattoo',
  color: 'Finishing the tattoo in color',
  photo: 'Revealing the full photograph',
  complete: 'Finished tattoo'
}

function DrawingStroke ({ d, clock, timing, pass, width }: { d: string, clock: MotionValue<number>, timing: InkStrokeTiming | undefined, pass: 'outline' | 'shading' | 'color', width: number }) {
  const pathLength = useTransform(clock, time => timing ? getStrokeProgress(time, timing) : 0)
  const opacity = useTransform(pathLength, value => value > 0 ? 1 : 0)
  return <m.path d={d} data-ink-stroke={pass} fill="none" stroke={pass === 'outline' ? '#171717' : '#fff'} strokeWidth={width} vectorEffect={pass === 'outline' ? 'non-scaling-stroke' : undefined} strokeLinecap="round" strokeLinejoin="round" style={{ pathLength, opacity }} />
}

export default function TattooDrawReveal ({ image, paths, fill }: TattooDrawRevealProps) {
  return <InkDrawing key={image.src + paths.join('|') + fill.region + fill.paths.join('|') + fill.strokeWidth} image={image} paths={paths} fill={fill} />
}

function getStatusLabel (status: string, ready: boolean, phase: InkPhase, originalOnly: boolean) {
  if (status === 'waiting') return ready ? 'Ready to draw' : 'Preparing image'
  if (status === 'complete' && originalOnly) return 'Original photograph'
  return phaseLabels[phase]
}

function getInkPresentation ({ enabled, ready, failed, originalVisible, status }: { enabled: boolean, ready: boolean, failed: boolean, originalVisible: boolean, status: string }) {
  const renderable = ready && !failed
  const canReplay = enabled && renderable
  const originalOnly = originalVisible || failed
  const enhanced = renderable && !originalVisible
  const drawing = canReplay && !originalVisible && status !== 'complete'
  return {
    canReplay,
    originalOnly,
    speedDisabled: !enabled || failed,
    showSketch: drawing,
    svgVisibility: enhanced ? 'visible' : 'hidden',
    overlayVisibility: drawing ? 'visible' : 'hidden'
  } as const
}

function InkDrawing ({ image, paths, fill }: TattooDrawRevealProps) {
  const { enabled } = useDesignMotion()
  const frameRef = useRef<HTMLButtonElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const needleRef = useRef<SVGGElement>(null)
  const geometryRef = useRef<SVGPathElement[]>([])
  const timingsRef = useRef<InkStrokeTiming[]>([])
  const animationRef = useRef<{ stop: () => void, speed: number } | null>(null)
  const startedRef = useRef(false)
  const initialTime = enabled ? 0 : INK_DURATION
  const clock = useMotionValue(initialTime)
  const inView = useInView(frameRef, { amount: 0.25 })
  const [timings, setTimings] = useState<InkStrokeTiming[]>([])
  const [ready, setReady] = useState(false)
  const [failure, setFailure] = useState<Error | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [originalVisible, setOriginalVisible] = useState(false)
  const [speed, setSpeed] = useState(1)
  const playback = useMotionValue<'waiting' | 'playing' | 'complete'>(enabled ? 'waiting' : 'complete')
  const phaseValue = useMotionValue<InkPhase>(getInkPhase(initialTime))
  const status = useInkSnapshot(playback)
  const phase = useInkSnapshot(phaseValue)
  const statusId = useId()
  const speedId = statusId + '-speed'
  const shadingMaskId = statusId + '-shading'
  const colorMaskId = statusId + '-color'
  const regionId = statusId + '-region'
  const inkDepthId = statusId + '-ink-depth'
  const photoOpacity = useTransform(clock, [COLOR_END, INK_DURATION], [0, 1])
  const surfaceOpacity = useTransform(clock, [COLOR_END, INK_DURATION], [1, 0])
  const contoursOpacity = useTransform(clock, [OUTLINE_END, SHADING_END], [1, 0])

  const finish = useCallback(() => {
    animationRef.current?.stop()
    animationRef.current = null
    startedRef.current = true
    clock.set(INK_DURATION)
    playback.set('complete')
  }, [clock, playback])

  const play = useCallback(() => {
    if (!enabled || !ready || failure) return
    animationRef.current?.stop()
    startedRef.current = true
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
    let cancelled = false
    startedRef.current = false
    const photo = imageRef.current
    const svg = svgRef.current

    async function prepare () {
      try {
        if (!photo || !svg) throw new Error('Drawing frame is unavailable')
        await photo.decode()
        if (cancelled) return
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
        if (cancelled) return
        setFailure(new Error('Unable to prepare the sketch', { cause: error }))
        finish()
      }
    }

    void prepare()
    return () => {
      cancelled = true
      animationRef.current?.stop()
    }
  }, [image.src, paths, fill, finish])

  useEffect(() => {
    if (!enabled) finish()
    else if (ready && inView && !startedRef.current) play()
  }, [enabled, finish, inView, play, ready])

  function changeSpeed (nextSpeed: number) {
    setSpeed(nextSpeed)
    if (animationRef.current) animationRef.current.speed = nextSpeed
  }

  function replay () {
    setOriginalVisible(false)
    play()
  }

  function showOriginal () {
    finish()
    setOriginalVisible(true)
  }

  function showViewer () {
    finish()
    setViewerOpen(true)
  }

  const { canReplay, originalOnly, speedDisabled, showSketch, overlayVisibility, svgVisibility } = getInkPresentation({ enabled, ready, failed: failure !== null, originalVisible, status })
  const label = getStatusLabel(status, ready, phase, originalOnly)

  return (
    <div className={styles.study} data-ink-study="" data-ink-state={status} data-ink-phase={phase}>
      <div className={styles.speedControl}>
        <span id={speedId}>Drawing speed</span>
        <Slider className="min-w-0 flex-1" aria-labelledby={speedId} min={0.25} max={2} step={0.25} value={[speed]} onValueChange={values => changeSpeed(values[0])} disabled={speedDisabled} aria-valuetext={speed + ' times normal speed'} />
        <span aria-hidden="true">{speed}×</span>
      </div>
      <button ref={frameRef} className={styles.frame} type="button" onClick={showViewer} aria-label={'View original: ' + image.alt} aria-describedby={statusId}>
        <span className={styles.paper} hidden={!showSketch} />
        <m.img ref={imageRef} className={styles.original} src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" style={{ opacity: photoOpacity }} />
        <m.svg ref={svgRef} className={styles.sketch} viewBox={'0 0 ' + image.width + ' ' + image.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" style={{ visibility: svgVisibility }}>
          <defs>
            <clipPath id={regionId} clipPathUnits="userSpaceOnUse"><path d={fill.region} data-ink-region="" /></clipPath>
            <filter id={inkDepthId} filterUnits="userSpaceOnUse" x={0} y={0} width={image.width} height={image.height} colorInterpolationFilters="sRGB">
              {/* Favor dark neutral tones over skin and colored highlights. */}
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.4252 5.0696 -3.6444 0 1" />
              <feComponentTransfer><feFuncA type="linear" slope={0.34} /></feComponentTransfer>
              <feComposite in2="SourceAlpha" operator="in" />
            </filter>
            <mask id={shadingMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0} width={image.width} height={image.height}>
              <g clipPath={'url(#' + regionId + ')'}>
                {fill.paths.map((d, index) => <DrawingStroke key={d} d={d} clock={clock} timing={timings[paths.length + index]} pass="shading" width={fill.strokeWidth} />)}
              </g>
            </mask>
            <mask id={colorMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0} width={image.width} height={image.height}>
              <g clipPath={'url(#' + regionId + ')'}>
                {fill.paths.map((d, index) => <DrawingStroke key={d} d={d} clock={clock} timing={timings[paths.length + fill.paths.length + index]} pass="color" width={fill.strokeWidth} />)}
              </g>
            </mask>
          </defs>
          <m.g data-ink-animation="" style={{ opacity: surfaceOpacity, visibility: overlayVisibility }}>
            <image data-ink-layer="shading" href={image.src} width={image.width} height={image.height} mask={'url(#' + shadingMaskId + ')'} className={styles.shading} />
            <image data-ink-depth-pass="shading" href={image.src} width={image.width} height={image.height} mask={'url(#' + shadingMaskId + ')'} filter={'url(#' + inkDepthId + ')'} />
            <image data-ink-layer="color" href={image.src} width={image.width} height={image.height} mask={'url(#' + colorMaskId + ')'} />
            <image data-ink-depth-pass="color" href={image.src} width={image.width} height={image.height} mask={'url(#' + colorMaskId + ')'} filter={'url(#' + inkDepthId + ')'} />
            <m.g style={{ opacity: contoursOpacity }}>
              {paths.map((d, index) => <DrawingStroke key={d} d={d} clock={clock} timing={timings[index]} pass="outline" width={2} />)}
            </m.g>
            <g ref={needleRef} data-ink-needle="" data-ink-machine="" className={styles.needle} stroke="#20242a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M -126 1 V -65 Q -126 -70 -121 -70 H -62 V -58 H -110 V -14 H -80 V 1 Z" fill="#30363d" />
              <rect x={-116} y={-19} width={57} height={7} rx={2} fill="#b7bec5" />
              <rect x={-112} y={-50} width={19} height={32} rx={4} fill="#bd7b46" />
              <rect x={-85} y={-50} width={19} height={32} rx={4} fill="#bd7b46" />
              <path d="M -110 -43 H -95 M -110 -36 H -95 M -110 -29 H -95 M -83 -43 H -68 M -83 -36 H -68 M -83 -29 H -68" fill="none" stroke="#e3b580" strokeWidth={3} />
              <path d="M -120 -59 H -65 L -51 -49 L -55 -44 L -72 -52 H -120 Z" fill="#c4cbd1" />
              <path d="M -75 -70 V -81 H -63 V -59" fill="none" stroke="#515b65" strokeWidth={6} />
              <path d="M -68 -82 H -58" fill="none" stroke="#c4cbd1" strokeWidth={5} />
              <circle cx={-119} cy={-63} r={3} fill="#dbe0e4" />
              <circle cx={-119} cy={-7} r={3} fill="#dbe0e4" />
              <path d="M -79 -13 L -66 -5" fill="none" stroke="#9aa4ad" strokeWidth={7} />
              <rect x={-79} y={-12} width={44} height={24} rx={8} fill="#30363d" />
              <path d="M -70 -9 V 9 M -62 -10 V 10 M -54 -10 V 10 M -46 -10 V 10" fill="none" stroke="#7c8792" strokeWidth={3} />
              <path d="M -35 -8 H -22 L -10 -3 V 3 L -22 8 H -35 Z" fill="#bcc5cd" />
              <path d="M -10 0 H 0" fill="none" stroke="#171717" strokeWidth={2.5} />
            </g>
          </m.g>
          <m.g data-ink-depth="" className={styles.inkDepth} style={{ opacity: photoOpacity }}>
            <image href={image.src} width={image.width} height={image.height} clipPath={'url(#' + regionId + ')'} filter={'url(#' + inkDepthId + ')'} />
          </m.g>
        </m.svg>
        <span className={styles.enlarge} aria-hidden="true"><Maximize2 size={16} />View original</span>
      </button>
      <div className={styles.status}><p id={statusId} role="status">{label}</p><span>{(INK_DURATION / speed).toFixed(1)} s</span></div>
      <div className={styles.controls}>
        <Button variant="outline" onClick={replay} disabled={!canReplay}><RotateCcw data-icon="inline-start" aria-hidden="true" />Replay animation</Button>
        <Button variant="outline" onClick={showOriginal} disabled={originalOnly}>Show original</Button>
      </div>
      <DesignDialog title="Original photograph" image={image} open={viewerOpen} onClose={() => setViewerOpen(false)} returnFocusRef={frameRef} />
    </div>
  )
}
