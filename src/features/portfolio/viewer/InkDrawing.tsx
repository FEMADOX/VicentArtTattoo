import { useCallback, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useInView, useTransform } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import ArtworkDialog from '../ArtworkDialog'
import { Button } from '@/components/ui/button'
import Slider from '@/components/ui/slider'
import { useSiteMotion } from '@/motion/useSiteMotion'
import { INK_DURATION, OUTLINE_END, SHADING_END, COLOR_END } from '../utils/ink-timeline'
import type { InkPhase } from '../utils/ink-timeline'
import type { InkFillPattern } from '../utils/ink-drawing'
import useInkPlayback from './hooks/useInkPlayback'
import useInkSnapshot from './hooks/useInkSnapshot'
import useTattooViews from './hooks/useTattooViews'
import TattooVideoViewer from './TattooVideoViewer'
import type { TattooImage, TattooViewFrame, TattooViewSequence } from '../utils/ink-views'
import type { TattooVideoConfig } from '../utils/video-view'
import { InkEnlargeButton, InkViewControls } from './InkViewControls'
import InkDrawingSurface from './InkDrawingSurface'

const styles = {
  study: 'group/ink min-w-0',
  frame: 'relative isolate block w-full overflow-hidden border border-border bg-[#f2f2f2] p-0 text-left text-[#171717]',
  status: 'flex min-h-12 items-center justify-between gap-4 text-xs/[inherit] text-body [&>span]:whitespace-nowrap [&>span]:text-muted-foreground',
  controls: 'flex flex-wrap gap-3 [&>button]:flex-1 [@media(width<=390px)]:flex-col',
  speedControl: 'mb-4 flex flex-wrap items-center gap-3 font-mono text-xs text-body [&>span]:whitespace-nowrap [&>span:last-child]:min-w-[4ch] [&>span:last-child]:text-right [&>span:last-child]:tabular-nums'
}

export type InkDrawingProps = {
  image: TattooImage
  paths: readonly string[]
  fill: InkFillPattern
  sequence?: TattooViewSequence | undefined
  video?: TattooVideoConfig | undefined
  initialComplete?: boolean | undefined
  onAnimationStart?: (() => void) | undefined
  inDialog?: boolean | undefined
}

const phaseLabels: Record<InkPhase, string> = {
  outline: 'Drawing the contours',
  shading: 'Shading the whole tattoo',
  color: 'Finishing the tattoo in color',
  photo: 'Revealing the full photograph',
  complete: 'Finished tattoo'
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

function useDrawingInView (inDialog: boolean) {
  const frameRef = useRef<HTMLDivElement>(null)
  const inView = useInView(frameRef, { amount: inDialog ? 'some' : 0.25 })
  const onFrameChange = useCallback((element: HTMLDivElement | null) => {
    frameRef.current = element
  }, [])
  return { inView, onFrameChange }
}

type InkDrawingFrameProps = {
  video: TattooVideoConfig | undefined
  image: TattooImage
  onFrameChange: (element: HTMLDivElement | null) => void
  complete: boolean
  resetKey: number
  reducedMotion: boolean
  children: ReactNode
  pointerHandlers: ReturnType<typeof useTattooViews>['pointerHandlers']
  inDialog: boolean
  onEnlarge: () => void
  onEnlargeButton: (element: HTMLButtonElement | null) => void
  statusId: string
  multiple: boolean
}

const InkDrawingFrame = ({ video, image, onFrameChange, complete, resetKey, reducedMotion, children, pointerHandlers, inDialog, onEnlarge, onEnlargeButton, statusId, multiple }: InkDrawingFrameProps) => {
  if (video) return <TattooVideoViewer video={video} image={image} onFrameChange={onFrameChange} complete={complete} resetKey={resetKey} reducedMotion={reducedMotion}>{children}</TattooVideoViewer>
  return (
    <div ref={onFrameChange} className={styles.frame} {...pointerHandlers} style={{ touchAction: 'pan-y pinch-zoom' }}>
      {children}
      {!inDialog && <InkEnlargeButton multiple={multiple} buttonRef={onEnlargeButton} onClick={onEnlarge} statusId={statusId} alt={image.alt} />}
    </div>
  )
}

type InkOriginalControlsProps = {
  video: TattooVideoConfig | undefined
  inDialog: boolean
  originalVisible: boolean
  status: string
  showOriginalDisabled: boolean
  onFinish: () => void
  onShowOriginal: () => void
  onShowViewer: () => void
  onShowRecordedViews: () => void
  onOriginalButton: (element: HTMLButtonElement | null) => void
}

const InkOriginalControls = ({ video, inDialog, originalVisible, status, showOriginalDisabled, onFinish, onShowOriginal, onShowViewer, onShowRecordedViews, onOriginalButton }: InkOriginalControlsProps) => {
  if (video) {
    return <><Button variant="outline" onClick={onFinish} disabled={status === 'complete'}>Skip drawing</Button><Button ref={onOriginalButton} variant="outline" onClick={inDialog && originalVisible ? onShowRecordedViews : onShowViewer} disabled={status !== 'complete'}>{inDialog && originalVisible ? 'Explore recorded views' : 'Original photo'}</Button></>
  }
  if (inDialog) return <><Button variant="outline" onClick={onFinish} disabled={status === 'complete'}>Skip drawing</Button><Button variant="outline" onClick={onShowOriginal} disabled={showOriginalDisabled}>Show original</Button></>
  return <Button variant="outline" onClick={onShowOriginal} disabled={showOriginalDisabled}>Show original</Button>
}

const InkDrawing = (props: InkDrawingProps) => {
  const { video, initialComplete, onAnimationStart, inDialog = false } = props
  const { enabled } = useSiteMotion()
  const [drawing] = useState(() => ({ image: props.image, paths: props.paths, fill: props.fill, sequence: props.sequence }))
  const { image, paths, fill, sequence } = drawing
  const [originalElement, setOriginalElement] = useState<HTMLButtonElement | null>(null)
  const [speed, setSpeed] = useState(1)
  const { inView, onFrameChange } = useDrawingInView(inDialog)
  const { clock, playback, phaseValue, timings, ready, failure, imageRef, svgRef, needleRef, finish, play } = useInkPlayback({ enabled, inView, initialComplete, image, paths, fill, speed, onAnimationStart })
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerImage, setViewerImage] = useState<TattooImage>(image)
  const [originalVisible, setOriginalVisible] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const status = useInkSnapshot(playback)
  const phase = useInkSnapshot(phaseValue)
  const views = useTattooViews({ sequence, image, visible: inView, interactive: isViewInteractive(status, viewerOpen) })
  const { exploring, displayed, depthVisibility } = getInkDisplayState(sequence, status, views.frame, image)

  const statusId = useId()
  const speedId = statusId + '-speed'
  const shadingMaskId = statusId + '-shading'
  const colorMaskId = statusId + '-color'
  const regionId = statusId + '-region'
  const inkDepthId = statusId + '-ink-depth'
  const photoOpacity = useTransform(clock, [COLOR_END, INK_DURATION], [0, 1])
  const surfaceOpacity = useTransform(clock, [COLOR_END, INK_DURATION], [1, 0])
  const contoursOpacity = useTransform(clock, [OUTLINE_END, SHADING_END], [1, 0])

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

  const drawingSurface = <InkDrawingSurface image={image} displayed={displayed} fill={fill} paths={paths} timings={timings} clock={clock} photoOpacity={photoOpacity} surfaceOpacity={surfaceOpacity} contoursOpacity={contoursOpacity} showSketch={showSketch} svgVisibility={svgVisibility} overlayVisibility={overlayVisibility} exploring={exploring} enhanceBlacks={enhanceBlacks} depthVisibility={depthVisibility} regionId={regionId} shadingMaskId={shadingMaskId} colorMaskId={colorMaskId} inkDepthId={inkDepthId} imageRef={imageRef} svgRef={svgRef} needleRef={needleRef} />

  return (
    <div className={styles.study} data-ink-study="" data-ink-state={status} data-ink-phase={phase} data-ink-views={getViewIndex(sequence, views.index)} data-ink-video={video?.sources.at(-1)?.src} data-drawing-state={getDrawingState(video, status)}>
      <div className={styles.speedControl}>
        <span id={speedId}>Drawing speed</span>
        <Slider className="min-w-0 flex-1" aria-labelledby={speedId} min={0.25} max={2} step={0.25} value={[speed]} onValueChange={values => setSpeed(values[0] ?? 1)} disabled={speedDisabled} aria-valuetext={speed + ' times normal speed'} />
        <span aria-hidden="true">{speed}Ãƒâ€”</span>
      </div>
      <InkDrawingFrame video={video} image={image} onFrameChange={onFrameChange} complete={status === 'complete' && !originalVisible} resetKey={resetKey} reducedMotion={!enabled} pointerHandlers={views.pointerHandlers} inDialog={inDialog} onEnlarge={showViewer} onEnlargeButton={setOriginalElement} statusId={statusId} multiple={sequence !== undefined}>{drawingSurface}</InkDrawingFrame>
      <InkViewControls sequence={sequence} views={views} active={exploring} viewerOpen={viewerOpen} />
      <div className={styles.status}><p id={statusId} role="status">{label}</p><span>{(INK_DURATION / speed).toFixed(1)} s</span></div>
      <div className={styles.controls}>
        <Button variant="outline" onClick={replay} disabled={!canReplay}><RotateCcw data-icon="inline-start" aria-hidden="true" />Animation</Button>
        <InkOriginalControls video={video} inDialog={inDialog} originalVisible={originalVisible} status={status} showOriginalDisabled={showOriginalDisabled} onFinish={finish} onShowOriginal={showOriginal} onShowViewer={showViewer} onShowRecordedViews={showRecordedViews} onOriginalButton={setOriginalElement} />
      </div>
      {!inDialog && <ArtworkDialog title="Original photograph" image={viewerImage} open={viewerOpen} onClose={() => setViewerOpen(false)} returnFocus={() => originalElement?.focus({ preventScroll: true })} />}
    </div>
  )
}

export default InkDrawing
