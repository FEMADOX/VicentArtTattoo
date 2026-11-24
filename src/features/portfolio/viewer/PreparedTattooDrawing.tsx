import { useEffect, useState, type ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import ArtworkDialog from '../ArtworkDialog'
import TattooVideoViewer from './TattooVideoViewer'
import { parseTattooDrawing } from '../utils/ink-drawing'
import type { TattooDrawingData } from '../utils/ink-drawing'
import type { TattooImage } from '../utils/ink-views'
import type { TattooVideoConfig } from '../utils/video-view'
import { useSiteMotion } from '@/motion/useSiteMotion'

type PreparedTattooDrawingProps = {
  image: TattooImage
  drawingUrl: string
  video?: TattooVideoConfig | undefined
  initialComplete?: boolean | undefined
  onAnimationStart?: (() => void) | undefined
  playOnMount?: boolean | undefined
  inDialog?: boolean | undefined
  renderDrawing: (drawing: TattooDrawingData) => ReactElement
}

function usePreparedDrawing (drawingUrl: string, playOnMount: boolean) {
  const [drawing, setDrawing] = useState<TattooDrawingData | null>(null)
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

type PreparedDrawingPhotoProps = {
  image: TattooImage
  video?: TattooVideoConfig | undefined
  originalVisible: boolean
  enabled: boolean
  complete: boolean
}

const PreparedDrawingPhoto = ({ image, video, originalVisible, enabled, complete }: PreparedDrawingPhotoProps) => {
  const photograph = <img className="block h-auto w-full border border-border bg-card object-contain" src={image.src} alt={image.alt} width={image.width} height={image.height} draggable={false} />
  if (video && !originalVisible) return <TattooVideoViewer video={video} image={image} complete={complete} resetKey={0} reducedMotion={!enabled}>{photograph}</TattooVideoViewer>
  return <div className="relative">{photograph}</div>
}

type PreparedDrawingStatusProps = {
  failed: boolean
  requested: boolean
}

const PreparedDrawingStatus = ({ failed, requested }: PreparedDrawingStatusProps) => {
  const label = failed
    ? 'Drawing unavailable. The original photograph is still available.'
    : requested ? 'Preparing drawing' : 'Finished tattoo'
  return <p className="py-4 text-base text-body" role="status">{label}</p>
}

type PreparedDrawingPhotoToggleProps = {
  inDialog: boolean
  video?: TattooVideoConfig | undefined
  originalVisible: boolean
  onChange: (visible: boolean) => void
}

const PreparedDrawingPhotoToggle = ({ inDialog, video, originalVisible, onChange }: PreparedDrawingPhotoToggleProps) => {
  if (!inDialog || !video) return null
  return <Button variant="outline" onClick={() => onChange(!originalVisible)}>{originalVisible ? 'Explore recorded views' : 'Original photo'}</Button>
}

type PreparedDrawingRetryProps = {
  failed: boolean
  requested: boolean
  enabled: boolean
  onRetry: () => void
}

const PreparedDrawingRetry = ({ failed, requested, enabled, onRetry }: PreparedDrawingRetryProps) => {
  if (requested && !failed) return null
  return <Button variant="outline" onClick={onRetry} disabled={!enabled}>{failed ? 'Retry drawing' : 'Play drawing'}</Button>
}

type OutsideOriginalPhotoProps = {
  inDialog: boolean
  image: TattooImage
  originalElement: HTMLButtonElement | null
  onOriginalButton: (element: HTMLButtonElement | null) => void
  viewerOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const OutsideOriginalPhoto = ({ inDialog, image, originalElement, onOriginalButton, viewerOpen, onOpen, onClose }: OutsideOriginalPhotoProps) => {
  if (inDialog) return null
  return <><Button ref={onOriginalButton} variant="outline" onClick={onOpen}>Original photo</Button><ArtworkDialog title="Original photograph" image={image} open={viewerOpen} onClose={onClose} returnFocus={() => originalElement?.focus({ preventScroll: true })} /></>
}

type PreparedDrawingViewProps = {
  image: TattooImage
  video?: TattooVideoConfig | undefined
  inDialog: boolean
  failed: boolean
  requested: boolean
  complete: boolean
  enabled: boolean
  onRetry: () => void
}

const PreparedDrawingView = ({ image, video, inDialog, failed, requested, complete, enabled, onRetry }: PreparedDrawingViewProps) => {
  const [originalVisible, setOriginalVisible] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [originalElement, setOriginalElement] = useState<HTMLButtonElement | null>(null)
  return (
    <div data-ink-study="" data-ink-video={video?.sources.at(-1)?.src} data-drawing-state={failed ? 'unavailable' : requested ? 'preparing' : 'idle'}>
      <PreparedDrawingPhoto image={image} video={video} originalVisible={originalVisible} enabled={enabled} complete={complete} />
      <PreparedDrawingStatus failed={failed} requested={requested} />
      <PreparedDrawingPhotoToggle inDialog={inDialog} video={video} originalVisible={originalVisible} onChange={setOriginalVisible} />
      <PreparedDrawingRetry failed={failed} requested={requested} enabled={enabled} onRetry={onRetry} />
      <OutsideOriginalPhoto inDialog={inDialog} image={image} originalElement={originalElement} onOriginalButton={setOriginalElement} viewerOpen={viewerOpen} onOpen={() => setViewerOpen(true)} onClose={() => setViewerOpen(false)} />
    </div>
  )
}

const PreparedTattooDrawing = ({ image, video, drawingUrl, playOnMount = true, inDialog = false, renderDrawing }: PreparedTattooDrawingProps) => {
  const { drawing, failed, requested, requestDrawing: retryDrawing } = usePreparedDrawing(drawingUrl, playOnMount)
  const { enabled } = useSiteMotion()

  if (drawing) return renderDrawing(drawing)

  return <PreparedDrawingView image={image} video={video} inDialog={inDialog} failed={failed} requested={requested} complete={!playOnMount || failed || !enabled} enabled={enabled} onRetry={retryDrawing} />
}

export default PreparedTattooDrawing
