import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import Slider from '@/components/ui/slider'
import cn from '@/lib/utils'
import type { TattooImage } from '../utils/ink-views'
import { getPointerVideoPosition, getVideoPositionText, type TattooVideoConfig } from '../utils/video-view'
import useAngleDrag from './hooks/useAngleDrag'
import useTattooVideoPlayback from './hooks/useTattooVideoPlayback'

type TattooVideoViewerProps = {
  video: TattooVideoConfig
  image: TattooImage
  onFrameChange?: ((element: HTMLDivElement | null) => void) | undefined
  complete: boolean
  resetKey: number
  reducedMotion: boolean
  children: ReactNode
}

const styles = {
  frame: 'relative overflow-hidden bg-black',
  layer: 'pointer-events-none absolute inset-0 size-full object-contain',
  controls: 'flex flex-col gap-3 border-t border-border px-4 py-3',
  angle: 'grid items-center gap-2 font-mono text-xs sm:grid-cols-[auto_1fr] sm:gap-4',
  footer: 'flex flex-wrap items-center justify-between gap-3',
  hint: 'max-w-96 text-sm text-muted-foreground'
}

function getVideoHint (state: string | Error, interactive: boolean, complete: boolean) {
  if (state instanceof Error) return 'Other views could not load. The photograph is still available.'
  if (interactive) return 'Drag the tattoo or use Viewing angle to explore the recorded views.'
  return complete ? 'Preparing the recorded views…' : 'Explore the recorded views when the drawing finishes.'
}

const TattooVideoViewer = ({ video, image, onFrameChange, complete, resetKey, reducedMotion, children }: TattooVideoViewerProps) => {
  const angleId = useId()
  const startPosition = useRef(0)
  const { videoRef, overlayRef, frameRef, positionRef, position, time, state, transition, interactive, updatePosition, resetView, flushPosition, cancelPosition, retry } = useTattooVideoPlayback({ video, image, onFrameChange, complete, reducedMotion })
  const { pointerHandlers, cancel } = useAngleDrag({
    enabled: interactive,
    onStart: () => { startPosition.current = positionRef.current },
    onChange: (deltaX, width) => updatePosition(getPointerVideoPosition(startPosition.current, deltaX, width)),
    onEnd: flushPosition,
    onCancel: cancelPosition
  })

  useEffect(() => {
    cancel()
    resetView()
  }, [cancel, resetKey, resetView])

  function reset () {
    cancel()
    resetView()
  }

  return (
    <div>
      <div
        ref={frameRef}
        className={styles.frame}
        style={{ aspectRatio: `${image.width} / ${image.height}`, touchAction: 'pan-y pinch-zoom' }}
        data-ink-video-frame
        data-video-state={state instanceof Error ? 'error' : state}
        data-video-position={position}
        data-video-time={time}
        data-video-transition={transition}
        {...pointerHandlers}
      >
        {children}
        <video
          ref={videoRef}
          data-tattoo-video
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className={cn(styles.layer, 'z-4', interactive ? 'opacity-100' : 'opacity-0')}
        />
        <canvas
          ref={overlayRef}
          aria-hidden="true"
          data-video-cut-overlay
          className={cn(styles.layer, 'z-5', transition === 'holding' && interactive ? 'opacity-100' : 'opacity-0')}
          style={{ transition: transition === 'fading' && !reducedMotion ? 'opacity 240ms ease' : 'none' }}
        />
      </div>
      <div className={styles.controls}>
        <div className={styles.angle}>
          <span id={angleId}>Viewing angle</span>
          <Slider
            aria-labelledby={angleId}
            aria-valuetext={getVideoPositionText(position)}
            min={-100}
            max={100}
            step={1}
            disabled={!interactive}
            value={[position]}
            onValueChange={values => {
              cancel()
              updatePosition(values[0] ?? 0)
            }}
          />
        </div>
        <div className={styles.footer}>
          <p className={styles.hint} role="status">
            {getVideoHint(state, interactive, complete)}
          </p>
          <Button type="button" variant="outline" size="sm" disabled={!interactive} onClick={reset}>Reset view</Button>
          {state instanceof Error && <Button type="button" variant="outline" size="sm" onClick={retry}>Retry recorded views</Button>}
        </div>
      </div>
    </div>
  )
}

export default TattooVideoViewer
