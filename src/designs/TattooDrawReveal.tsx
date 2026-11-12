import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { animate, useInView, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { DesignDialog } from './DesignDialog'
import { Button } from '../components/ui/button'
import { Slider } from '../components/ui/slider'
import { useDesignMotion } from './motion'
import { createInkTimeline, getActiveInkStroke, getInkPhase, INK_DURATION, OUTLINE_END, SHADING_END, COLOR_END } from './ink-timeline'
import type { InkPhase, InkStrokeTiming } from './ink-timeline'
import type { InkFillPattern } from './ink-fill-paths'
import { useInkSnapshot } from './useInkSnapshot'
import TattooVideoViewer from './TattooVideoViewer'
import type { TattooImage, TattooViewFrame, TattooViewSequence } from './ink-views'
import type { TattooVideoConfig } from './video-view'
import { parseTattooDrawing } from './ink-drawing'
import { useTattooViews } from './useTattooViews'
import { InkEnlargeButton, InkViewControls } from './InkViewControls'
import InkDrawingSurface from './InkDrawingSurface'

const styles = {
  study: 'group/ink min-w-0',
  frame: 'relative isolate block w-full overflow-hidden border border-border bg-[#f2f2f2] p-0 text-left text-[#171717]',
  status: 'flex min-h-12 items-center justify-between gap-4 text-xs/[inherit] text-body [&>span]:whitespace-nowrap [&>span]:text-muted-foreground',
  controls: 'flex flex-wrap gap-3 [&>button]:flex-1 [@media(width<=390px)]:flex-col',
  speedControl: 'mb-4 flex flex-wrap items-center gap-3 font-mono text-xs text-body [&>span]:whitespace-nowrap [&>span:last-child]:min-w-[4ch] [&>span:last-child]:text-right [&>span:last-child]:tabular-nums'
}

type TattooDrawRevealProps = {
  image: TattooImage
  paths: readonly string[]
  fill: InkFillPattern
  sequence?: TattooViewSequence | undefined
  video?: TattooVideoConfig | undefined
  initialComplete?: boolean | undefined
  onAnimationStart?: (() => void) | undefined
  playOnMount?: boolean | undefined
  inDialog?: boolean | undefined
}

const phaseLabels: Record<InkPhase, string> = {
  outline: 'Drawing the contours',
  shading: 'Shading the whole tattoo',
  color: 'Finishing the tattoo in color',
  photo: 'Revealing the full photograph',
  complete: 'Finished tattoo'
}

export default function TattooDrawReveal (props: TattooDrawRevealProps | PreparedDrawingProps) {
  if ('drawingUrl' in props) return <PreparedDrawing key={props.image.src + props.drawingUrl} {...props} />
  const { image, paths, fill, sequence } = props
  return <InkDrawing key={image.src + paths.join('|') + fill.region + fill.paths.join('|') + fill.strokeWidth + JSON.stringify(sequence)} {...props} />
}

type PreparedDrawingProps = Omit<TattooDrawRevealProps, 'paths' | 'fill'> & {
  drawingUrl: string
}

function usePreparedDrawing (drawingUrl: string, playOnMount: boolean) {
  const [drawing, setDrawing] = useState<{ paths: readonly string[], fill: InkFillPattern } | null>(null)
  const [failed, setFailed] = useState(false)
  const [requested, setRequested] = useState(playOnMount)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!requested) return
    const controller = new AbortController()
    void fetch(drawingUrl, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Drawing data is unavailable')
        const data: unknown = await response.json()
        const result = parseTattooDrawing(data)
        if (!controller.signal.aborted) setDrawing(result)
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true)
      })
    return () => controller.abort()
  }, [attempt, drawingUrl, requested])

  function requestDrawing () {
    setFailed(false)
    setRequested(true)
    setAttempt(value => value + 1)
  }

  return { drawing, failed, requested, requestDrawing }
}

function PreparedDrawingPhoto ({ image, video, frameRef, originalVisible, enabled, complete }: { image: TattooImage, video?: TattooVideoConfig | undefined, frameRef: RefObject<HTMLDivElement | null>, originalVisible: boolean, enabled: boolean, complete: boolean }) {
  const photograph = <img className="block h-auto w-full border border-border bg-card object-contain" src={image.src} alt={image.alt} width={image.width} height={image.height} />
  if (video && !originalVisible) return <TattooVideoViewer video={video} image={image} frameRef={frameRef} complete={complete} resetKey={0} reducedMotion={!enabled}>{photograph}</TattooVideoViewer>
  return <div ref={frameRef} className="relative">{photograph}</div>
}

function PreparedDrawingStatus ({ failed, requested }: { failed: boolean, requested: boolean }) {
  const label = failed
    ? 'Drawing unavailable. The original photograph and recorded views are still available.'
    : requested ? 'Preparing drawing' : 'Finished tattoo'
  return <p className="py-4 text-base text-body" role="status">{label}</p>
}

function PreparedDrawingPhotoToggle ({ inDialog, video, originalVisible, onChange }: { inDialog: boolean, video?: TattooVideoConfig | undefined, originalVisible: boolean, onChange: (visible: boolean) => void }) {
  if (!inDialog || !video) return null
  return <Button variant="outline" onClick={() => onChange(!originalVisible)}>{originalVisible ? 'Explore recorded views' : 'Original photo'}</Button>
}

function PreparedDrawingRetry ({ failed, requested, enabled, onRetry }: { failed: boolean, requested: boolean, enabled: boolean, onRetry: () => void }) {
  if (requested && !failed) return null
  return <Button variant="outline" onClick={onRetry} disabled={!enabled}>{failed ? 'Retry drawing' : 'Play drawing'}</Button>
}

function OutsideOriginalPhoto ({ inDialog, image, originalRef, viewerOpen, onOpen, onClose }: { inDialog: boolean, image: TattooImage, originalRef: RefObject<HTMLButtonElement | null>, viewerOpen: boolean, onOpen: () => void, onClose: () => void }) {
  if (inDialog) return null
  return <><Button ref={originalRef} variant="outline" onClick={onOpen}>Original photo</Button><DesignDialog title="Original photograph" image={image} open={viewerOpen} onClose={onClose} returnFocusRef={originalRef} /></>
}

function PreparedDrawingView ({ image, video, inDialog, failed, requested, complete, onRetry }: { image: TattooImage, video?: TattooVideoConfig | undefined, inDialog: boolean, failed: boolean, requested: boolean, complete: boolean, onRetry: () => void }) {
  const [originalVisible, setOriginalVisible] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const originalRef = useRef<HTMLButtonElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const { enabled } = useDesignMotion()

  return (
    <div data-ink-study="" data-ink-video={video?.sources.at(-1)?.src} data-drawing-state={failed ? 'unavailable' : requested ? 'preparing' : 'idle'}>
      <PreparedDrawingPhoto image={image} video={video} frameRef={frameRef} originalVisible={originalVisible} enabled={enabled} complete={complete} />
      <PreparedDrawingStatus failed={failed} requested={requested} />
      <PreparedDrawingPhotoToggle inDialog={inDialog} video={video} originalVisible={originalVisible} onChange={setOriginalVisible} />
      <PreparedDrawingRetry failed={failed} requested={requested} enabled={enabled} onRetry={onRetry} />
      <OutsideOriginalPhoto inDialog={inDialog} image={image} originalRef={originalRef} viewerOpen={viewerOpen} onOpen={() => setViewerOpen(true)} onClose={() => setViewerOpen(false)} />
    </div>
  )
}

function PreparedDrawing ({ image, video, drawingUrl, initialComplete, onAnimationStart, playOnMount = true, inDialog = false }: PreparedDrawingProps) {
  const { drawing, failed, requested, requestDrawing: retryDrawing } = usePreparedDrawing(drawingUrl, playOnMount)

  if (drawing) return <InkDrawing image={image} paths={drawing.paths} fill={drawing.fill} video={video} initialComplete={playOnMount ? initialComplete : false} onAnimationStart={onAnimationStart} inDialog={inDialog} />

  return <PreparedDrawingView image={image} video={video} inDialog={inDialog} failed={failed} requested={requested} complete={!playOnMount} onRetry={retryDrawing} />
}

function getStatusLabel (status: string, ready: boolean, phase: InkPhase, originalOnly: boolean) {
  if (status === 'waiting') return ready ? 'Ready to draw' : 'Preparing image'
  if (status === 'complete' && originalOnly) return 'Original photograph'
  return phaseLabels[phase]
}

function isOriginalShown (originalOnly: boolean, index: number, referenceIndex: number | undefined) {
  return originalOnly && (referenceIndex === undefined || index === referenceIndex)
}

function getInkPresentation ({ enabled, ready, failed, originalVisible, status, referenceIndex, index }: { enabled: boolean, ready: boolean, failed: boolean, originalVisible: boolean, status: string, referenceIndex: number | undefined, index: number }) {
  const renderable = ready && !failed
  const canReplay = enabled && renderable
  const originalOnly = originalVisible || failed
  const enhanced = renderable && !originalVisible
  const drawing = canReplay && !originalVisible && status !== 'complete'
  return {
    canReplay,
    originalOnly,
    showOriginalDisabled: isOriginalShown(originalOnly, index, referenceIndex),
    speedDisabled: !enabled || failed,
    showSketch: drawing,
    svgVisibility: enhanced ? 'visible' : 'hidden',
    overlayVisibility: drawing ? 'visible' : 'hidden'
  } as const
}

function getInkDisplayState (sequence: TattooViewSequence | undefined, status: string, frame: TattooViewFrame, image: TattooImage): { exploring: boolean, displayed: TattooImage | TattooViewFrame, depthVisibility: 'visible' | 'hidden' } {
  const exploring = sequence !== undefined && status === 'complete'
  return { exploring, displayed: exploring ? frame : image, depthVisibility: sequence === undefined ? 'visible' : 'hidden' }
}

function getViewIndex (sequence: TattooViewSequence | undefined, index: number) {
  return sequence === undefined ? undefined : String(index)
}

function getDrawingState (video: TattooVideoConfig | undefined, status: string) {
  return video === undefined ? undefined : status
}

function isViewInteractive (status: string, viewerOpen: boolean) {
  return status === 'complete' && !viewerOpen
}

function useInkPlayback (enabled: boolean, initialComplete = false) {
  const startedRef = useRef(initialComplete)
  const initialTime = enabled && !initialComplete ? 0 : INK_DURATION
  const clock = useMotionValue(initialTime)
  const playback = useMotionValue<'waiting' | 'playing' | 'complete'>(initialTime === 0 ? 'waiting' : 'complete')
  const phaseValue = useMotionValue<InkPhase>(getInkPhase(initialTime))
  return { startedRef, clock, playback, phaseValue }
}

function useInkAutoplay ({ enabled, finish, ready, inView, play, startedRef }: { enabled: boolean, finish: () => void, ready: boolean, inView: boolean, play: () => void, startedRef: RefObject<boolean> }) {
  useEffect(() => {
    if (!enabled) finish()
    else if (ready && inView && !startedRef.current) play()
  }, [enabled, finish, inView, play, ready, startedRef])
}

function InkDrawing ({ image, paths, fill, sequence, video, initialComplete, onAnimationStart, inDialog = false }: TattooDrawRevealProps) {
  const { enabled } = useDesignMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const originalRef = useRef<HTMLButtonElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const needleRef = useRef<SVGGElement>(null)
  const geometryRef = useRef<SVGPathElement[]>([])
  const timingsRef = useRef<InkStrokeTiming[]>([])
  const animationRef = useRef<{ stop: () => void, speed: number } | null>(null)
  const { startedRef, clock, playback, phaseValue } = useInkPlayback(enabled, initialComplete)
  const inView = useInView(frameRef, { amount: 0.25 })
  const [timings, setTimings] = useState<InkStrokeTiming[]>([])
  const [ready, setReady] = useState(false)
  const [failure, setFailure] = useState<Error | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerImage, setViewerImage] = useState<TattooImage>(image)
  const [originalVisible, setOriginalVisible] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [resetKey, setResetKey] = useState(0)
  const status = useInkSnapshot(playback)
  const phase = useInkSnapshot(phaseValue)
  const views = useTattooViews({ sequence, image, visible: inView, interactive: isViewInteractive(status, viewerOpen), passive: enabled })
  const { exploring, displayed, depthVisibility } = getInkDisplayState(sequence, status, views.frame, image)
  const animationStartRef = useRef(onAnimationStart)

  useEffect(() => {
    animationStartRef.current = onAnimationStart
  }, [onAnimationStart])
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
    if (!startedRef.current) animationStartRef.current?.()
    startedRef.current = true
    clock.set(INK_DURATION)
    playback.set('complete')
  }, [clock, playback, startedRef])

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
  }, [clock, enabled, failure, playback, ready, speed, startedRef])

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
    }
  }, [image.src, paths, fill, finish])

  useInkAutoplay({ enabled, finish, ready, inView, play, startedRef })

  function changeSpeed (nextSpeed: number) {
    setSpeed(nextSpeed)
    if (animationRef.current) animationRef.current.speed = nextSpeed
  }

  function replay () {
    views.reset()
    setOriginalVisible(false)
    setResetKey(value => value + 1)
    play()
  }

  function showOriginal () {
    views.reset()
    finish()
    setOriginalVisible(true)
  }

  function showViewer () {
    finish()
    if (inDialog) {
      setOriginalVisible(true)
      return
    }
    setViewerImage({ ...image, ...displayed })
    setViewerOpen(true)
  }

  function showRecordedViews () {
    setOriginalVisible(false)
    views.reset()
    setResetKey(value => value + 1)
  }

  const { canReplay, showOriginalDisabled, speedDisabled, showSketch, overlayVisibility, svgVisibility } = getInkPresentation({ enabled, ready, failed: failure !== null, originalVisible, status, referenceIndex: sequence?.referenceIndex, index: views.index })
  const label = getStatusLabel(status, ready, phase, showOriginalDisabled)
  const enhanceBlacks = !video

  const renderDrawingSurface = () => <InkDrawingSurface image={image} displayed={displayed} fill={fill} paths={paths} timings={timings} clock={clock} photoOpacity={photoOpacity} surfaceOpacity={surfaceOpacity} contoursOpacity={contoursOpacity} showSketch={showSketch} svgVisibility={svgVisibility} overlayVisibility={overlayVisibility} exploring={exploring} enhanceBlacks={enhanceBlacks} depthVisibility={depthVisibility} regionId={regionId} shadingMaskId={shadingMaskId} colorMaskId={colorMaskId} inkDepthId={inkDepthId} imageRef={imageRef} svgRef={svgRef} needleRef={needleRef} />

  const renderFrame = () => video
    ? <TattooVideoViewer video={video} image={image} frameRef={frameRef} complete={status === 'complete' && !originalVisible} resetKey={resetKey} reducedMotion={!enabled}>{renderDrawingSurface()}</TattooVideoViewer>
    : (
        <div ref={frameRef} className={styles.frame} {...views.pointerHandlers} style={{ touchAction: 'pan-y pinch-zoom' }}>
          {renderDrawingSurface()}
          {!inDialog && <InkEnlargeButton multiple={sequence !== undefined} buttonRef={originalRef} onClick={showViewer} statusId={statusId} alt={image.alt} />}
        </div>
      )

  const renderOriginalControls = () => video
    ? (
        <>
          <Button variant="outline" onClick={finish} disabled={status === 'complete'}>Skip drawing</Button>
          <Button ref={originalRef} variant="outline" onClick={inDialog && originalVisible ? showRecordedViews : showViewer} disabled={status !== 'complete'}>{inDialog && originalVisible ? 'Explore recorded views' : 'Original photo'}</Button>
        </>
      )
    : inDialog
      ? <><Button variant="outline" onClick={finish} disabled={status === 'complete'}>Skip drawing</Button><Button variant="outline" onClick={showOriginal} disabled={showOriginalDisabled}>Show original</Button></>
      : <Button variant="outline" onClick={showOriginal} disabled={showOriginalDisabled}>Show original</Button>

  return (
    <div className={styles.study} data-ink-study="" data-ink-state={status} data-ink-phase={phase} data-ink-views={getViewIndex(sequence, views.index)} data-ink-video={video?.sources.at(-1)?.src} data-drawing-state={getDrawingState(video, status)}>
      <div className={styles.speedControl}>
        <span id={speedId}>Drawing speed</span>
        <Slider className="min-w-0 flex-1" aria-labelledby={speedId} min={0.25} max={2} step={0.25} value={[speed]} onValueChange={values => changeSpeed(values[0])} disabled={speedDisabled} aria-valuetext={speed + ' times normal speed'} />
        <span aria-hidden="true">{speed}Ãƒâ€”</span>
      </div>
      {renderFrame()}
      <InkViewControls sequence={sequence} views={views} active={exploring} viewerOpen={viewerOpen} />
      <div className={styles.status}><p id={statusId} role="status">{label}</p><span>{(INK_DURATION / speed).toFixed(1)} s</span></div>
      <div className={styles.controls}>
        <Button variant="outline" onClick={replay} disabled={!canReplay}><RotateCcw data-icon="inline-start" aria-hidden="true" />Animation</Button>
        {renderOriginalControls()}
      </div>
      {!inDialog && <DesignDialog title="Original photograph" image={viewerImage} open={viewerOpen} onClose={() => setViewerOpen(false)} returnFocusRef={originalRef} />}
    </div>
  )
}
