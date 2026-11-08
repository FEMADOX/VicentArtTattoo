import { useCallback, useEffect, useId, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import type { TattooImage } from './ink-drawing'
import { clampVideoPosition, crossesVideoCut, getPointerVideoPosition, getVideoPositionText, getVideoTime, isTattooVideoConfig, type TattooVideoConfig } from './video-view'

type TattooVideoViewerProps = {
  video: TattooVideoConfig
  image: TattooImage
  frameRef: RefObject<HTMLDivElement | null>
  complete: boolean
  resetKey: number
  reducedMotion: boolean
  children: ReactNode
}

type PointerAnchor = {
  id: number
  x: number
  y: number
  position: number
  dragging: boolean
  scrolling: boolean
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
  return complete ? 'Preparing the recorded viewsâ€¦' : 'Explore the recorded views when the drawing finishes.'
}

export default function TattooVideoViewer ({ video, image, frameRef, complete, resetKey, reducedMotion, children }: TattooVideoViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const seekRef = useRef<((position: number) => void) | null>(null)
  const clearTransitionRef = useRef<(() => void) | null>(null)
  const hoverRef = useRef<PointerAnchor | null>(null)
  const dragRef = useRef<PointerAnchor | null>(null)
  const positionRef = useRef(0)
  const reducedRef = useRef(reducedMotion)
  const completeRef = useRef(complete)
  const pointerRequestRef = useRef(0)
  const [visible, setVisible] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<'waiting' | 'loading' | 'ready' | Error>('waiting')
  const [transition, setTransition] = useState<'idle' | 'holding' | 'fading'>('idle')
  const [position, setPosition] = useState(0)
  const [time, setTime] = useState(video.referenceTime)
  const angleId = useId()
  const interactive = complete && state === 'ready'

  useEffect(() => {
    completeRef.current = complete
    reducedRef.current = reducedMotion
    hoverRef.current = null
    dragRef.current = null
    if (pointerRequestRef.current) cancelAnimationFrame(pointerRequestRef.current)
    pointerRequestRef.current = 0
    if (reducedMotion) clearTransitionRef.current?.()
  }, [complete, reducedMotion])

  const updatePosition = useCallback((value: number) => {
    positionRef.current = clampVideoPosition(value)
    if (pointerRequestRef.current) return
    pointerRequestRef.current = requestAnimationFrame(() => {
      pointerRequestRef.current = 0
      setPosition(positionRef.current)
      seekRef.current?.(positionRef.current)
    })
  }, [])

  const resetView = useCallback(() => {
    hoverRef.current = null
    dragRef.current = null
    clearTransitionRef.current?.()
    updatePosition(0)
  }, [updatePosition])

  useEffect(() => {
    resetView()
  }, [resetKey, resetView])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.25 })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [frameRef])

  useEffect(() => {
    const element = videoRef.current
    const frame = frameRef.current
    if (!visible || !element || !frame) return
    let disposed = false
    if (!isTattooVideoConfig(video)) {
      queueMicrotask(() => {
        if (!disposed) setState(new Error('Invalid recorded views configuration'))
      })
      return () => {
        disposed = true
      }
    }
    let blocked = false
    let busy = false
    let hasFrame = false
    let requested = positionRef.current
    let applied = video.referenceTime
    let decodeRequest = 0
    let frameRequest = 0
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined = undefined
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined
    let fadeTimer: ReturnType<typeof setTimeout> | undefined = undefined
    let holding = false
    const sortedSources = [...video.sources].sort((first, second) => first.width - second.width)
    const preferredWidth = window.matchMedia('(max-width: 639px)').matches ? 480 : 720
    const source = sortedSources.find(candidate => candidate.width >= preferredWidth) ?? sortedSources[sortedSources.length - 1]

    function cancelDecode () {
      if (decodeRequest) element?.cancelVideoFrameCallback(decodeRequest)
      decodeRequest = 0
      if (frameRequest) cancelAnimationFrame(frameRequest)
      frameRequest = 0
      clearTimeout(fallbackTimer)
    }

    function clearTransition () {
      holding = false
      clearTimeout(fadeTimer)
      if (!disposed) setTransition('idle')
    }

    function fail (cause: unknown) {
      if (disposed || blocked) return
      blocked = true
      busy = false
      cancelDecode()
      clearTimeout(timeout)
      clearTransition()
      setState(new Error('Recorded views unavailable', { cause }))
    }

    function watchTimeout () {
      clearTimeout(timeout)
      timeout = setTimeout(() => fail(new Error('Recorded views loading timed out')), 30_000)
    }

    function snapshot () {
      if (!hasFrame || !completeRef.current || reducedRef.current) return
      const canvas = overlayRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context || !element?.videoWidth) return
      try {
        canvas.width = element.videoWidth
        canvas.height = element.videoHeight
        context.drawImage(element, 0, 0)
        clearTimeout(fadeTimer)
        holding = true
        setTransition('holding')
      } catch (error) {
        fail(error)
      }
    }

    function finishSeek () {
      if (disposed || blocked || !element || element.seeking || element.readyState < 2) return
      cancelDecode()
      clearTimeout(timeout)
      busy = false
      hasFrame = true
      applied = element.currentTime
      setTime(applied)
      setState('ready')
      if (holding) {
        holding = false
        if (reducedRef.current) clearTransition()
        else {
          setTransition('fading')
          fadeTimer = setTimeout(clearTransition, 240)
        }
      }
      if (Math.abs(getVideoTime(requested, video) - applied) >= 0.5 / video.fps) seek(requested)
    }

    function decoded () {
      if (disposed || blocked || !busy || !element || element.seeking || element.readyState < 2) return
      cancelDecode()
      if (typeof element.requestVideoFrameCallback === 'function') {
        decodeRequest = element.requestVideoFrameCallback(finishSeek)
      }
      // Paused seeks may not schedule a video callback in every browser.
      fallbackTimer = setTimeout(() => {
        frameRequest = requestAnimationFrame(() => {
          frameRequest = requestAnimationFrame(finishSeek)
        })
      }, 100)
    }

    function seek (value: number) {
      requested = clampVideoPosition(value)
      if (unavailable() || busy || !element || element.readyState < 1) return
      const target = getVideoTime(requested, video)
      if (hasFrame && Math.abs(target - applied) < 0.5 / video.fps) return
      if (crossesVideoCut(applied, target, video.cuts)) snapshot()
      if (blocked) return
      requestFrame(target)
    }

    function requestFrame (target: number) {
      if (!element) return
      busy = true
      watchTimeout()
      try {
        element.currentTime = target
        pollSeek()
      } catch (error) {
        fail(error)
      }
    }

    function pollSeek () {
      if (unavailable() || !busy || !element) return
      if (!element.seeking && element.readyState >= 2) decoded()
      else fallbackTimer = setTimeout(pollSeek, 50)
    }

    function unavailable () {
      return disposed || blocked
    }

    function metadata () {
      if (!element || disposed || blocked) return
      const aspectDifference = Math.abs(element.videoWidth / element.videoHeight / (image.width / image.height) - 1)
      if (!Number.isFinite(element.duration) || element.duration + 1 / video.fps < video.duration || aspectDifference > 0.01) {
        fail(new Error('Recorded views have incompatible dimensions or duration'))
        return
      }
      seek(requested)
    }

    function loading () {
      if (!disposed) setState('loading')
    }

    clearTransition()
    seekRef.current = seek
    clearTransitionRef.current = clearTransition
    element.addEventListener('loadstart', loading)
    element.addEventListener('loadedmetadata', metadata)
    element.addEventListener('loadeddata', decoded)
    element.addEventListener('seeked', decoded)
    element.addEventListener('error', fail)
    element.src = source.src
    element.load()
    watchTimeout()

    return () => {
      disposed = true
      seekRef.current = null
      clearTransitionRef.current = null
      cancelDecode()
      clearTimeout(timeout)
      clearTimeout(fadeTimer)
      element.removeEventListener('loadstart', loading)
      element.removeEventListener('loadedmetadata', metadata)
      element.removeEventListener('loadeddata', decoded)
      element.removeEventListener('seeked', decoded)
      element.removeEventListener('error', fail)
      element.pause()
      element.removeAttribute('src')
      element.load()
    }
  }, [attempt, frameRef, image.height, image.width, video, visible])

  useEffect(() => () => {
    if (pointerRequestRef.current) cancelAnimationFrame(pointerRequestRef.current)
  }, [])

  function anchor (event: PointerEvent<HTMLDivElement>): PointerAnchor {
    return { id: event.pointerId, x: event.clientX, y: event.clientY, position: positionRef.current, dragging: false, scrolling: false }
  }

  function clearPointer (event: PointerEvent<HTMLDivElement>) {
    const active = dragRef.current
    if (active && event.currentTarget.hasPointerCapture(active.id)) event.currentTarget.releasePointerCapture(active.id)
    dragRef.current = null
    hoverRef.current = interactive && !reducedMotion && event.pointerType === 'mouse' ? anchor(event) : null
  }

  function dragMove (event: PointerEvent<HTMLDivElement>, drag: PointerAnchor) {
    const deltaX = event.clientX - drag.x
    const deltaY = event.clientY - drag.y
    if (drag.scrolling) return
    if (!drag.dragging) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        drag.scrolling = true
        return
      }
      drag.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    event.preventDefault()
    updatePosition(getPointerVideoPosition(drag.position, deltaX, event.currentTarget.clientWidth))
  }

  function pointerMove (event: PointerEvent<HTMLDivElement>) {
    if (!interactive) return
    const drag = dragRef.current
    if (drag && drag.id === event.pointerId) {
      dragMove(event, drag)
    } else if (!reducedMotion && event.pointerType === 'mouse' && hoverRef.current) {
      updatePosition(getPointerVideoPosition(hoverRef.current.position, event.clientX - hoverRef.current.x, event.currentTarget.clientWidth))
    }
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
        onPointerEnter={event => {
          if (interactive && !reducedMotion && event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) hoverRef.current = anchor(event)
        }}
        onPointerLeave={event => {
          hoverRef.current = null
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) dragRef.current = null
        }}
        onPointerDown={event => {
          if (!event.isPrimary) {
            clearPointer(event)
            return
          }
          if (interactive && event.button === 0) dragRef.current = anchor(event)
        }}
        onPointerMove={pointerMove}
        onPointerUp={clearPointer}
        onPointerCancel={event => {
          clearPointer(event)
          hoverRef.current = null
        }}
        onLostPointerCapture={() => { dragRef.current = null }}
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
              hoverRef.current = null
              dragRef.current = null
              updatePosition(values[0] ?? 0)
            }}
          />
        </div>
        <div className={styles.footer}>
          <p className={styles.hint} role="status">
            {getVideoHint(state, interactive, complete)}
          </p>
          <Button type="button" variant="outline" size="sm" disabled={!interactive} onClick={resetView}>Reset view</Button>
          {state instanceof Error && <Button type="button" variant="outline" size="sm" onClick={() => setAttempt(value => value + 1)}>Retry recorded views</Button>}
        </div>
      </div>
    </div>
  )
}
