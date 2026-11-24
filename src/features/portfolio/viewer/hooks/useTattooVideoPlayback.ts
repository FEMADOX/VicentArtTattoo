import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import type { TattooImage } from '../../utils/ink-views'
import { clampVideoPosition, crossesVideoCut, getVideoTime, isTattooVideoConfig, type TattooVideoConfig } from '../../utils/video-view'

type TattooVideoPlaybackOptions = {
  video: TattooVideoConfig
  image: TattooImage
  onFrameChange?: ((element: HTMLDivElement | null) => void) | undefined
  complete: boolean
  reducedMotion: boolean
}

function useTattooVideoPlayback ({ video, image, onFrameChange, complete, reducedMotion }: TattooVideoPlaybackOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const setFrameRef = useCallback((element: HTMLDivElement | null) => {
    frameRef.current = element
    onFrameChange?.(element)
  }, [onFrameChange])
  const seekRef = useRef<((position: number) => void) | null>(null)
  const clearTransitionRef = useRef<(() => void) | null>(null)
  const cancelSeekRef = useRef<(() => void) | null>(null)
  const positionRef = useRef(0)
  const reducedRef = useRef(reducedMotion)
  const completeRef = useRef(complete)
  const pointerRequestRef = useRef(0)
  const visible = useInView(frameRef, { once: true, amount: 0.25 })
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<'waiting' | 'loading' | 'ready' | Error>('waiting')
  const [transition, setTransition] = useState<'idle' | 'holding' | 'fading'>('idle')
  const [position, setPosition] = useState(0)
  const [time, setTime] = useState(video.referenceTime)
  const interactive = complete && state === 'ready'

  useEffect(() => {
    completeRef.current = complete
    reducedRef.current = reducedMotion
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
    clearTransitionRef.current?.()
    updatePosition(0)
  }, [updatePosition])

  useEffect(() => {
    const element = videoRef.current
    const frame = frameRef.current
    if (!visible || !element || !frame) return
    const abortController = new AbortController()
    const { signal } = abortController
    if (!isTattooVideoConfig(video)) {
      queueMicrotask(() => {
        if (!signal.aborted) setState(new Error('Invalid recorded views configuration'))
      })
      return () => abortController.abort()
    }

    const playback = {
      blocked: false,
      busy: false,
      hasFrame: false,
      requested: positionRef.current,
      applied: video.referenceTime,
      appliedPosition: 0,
      targetPosition: 0,
      version: 0,
      decodeRequest: 0,
      frameRequest: 0,
      fallbackTimer: undefined as ReturnType<typeof setTimeout> | undefined,
      timeout: undefined as ReturnType<typeof setTimeout> | undefined,
      fadeTimer: undefined as ReturnType<typeof setTimeout> | undefined,
      holding: false
    }
    const sortedSources = [...video.sources].sort((first, second) => first.width - second.width)
    const preferredWidth = window.matchMedia('(max-width: 639px)').matches ? 480 : 720
    const source = sortedSources.find(candidate => candidate.width >= preferredWidth) ?? sortedSources[sortedSources.length - 1]

    function cancelDecode () {
      playback.version += 1
      if (playback.decodeRequest) element?.cancelVideoFrameCallback(playback.decodeRequest)
      playback.decodeRequest = 0

      if (playback.frameRequest) cancelAnimationFrame(playback.frameRequest)
      playback.frameRequest = 0

      clearTimeout(playback.fallbackTimer)
    }

    function clearTransition () {
      playback.holding = false
      clearTimeout(playback.fadeTimer)

      if (!signal.aborted) setTransition('idle')
    }

    function fail (cause: unknown) {
      if (signal.aborted || playback.blocked) return

      playback.blocked = true
      playback.busy = false
      cancelDecode()
      clearTimeout(playback.timeout)
      clearTransition()
      setState(new Error('Recorded views unavailable', { cause }))
    }

    function watchTimeout () {
      clearTimeout(playback.timeout)
      playback.timeout = setTimeout(() => fail(new Error('Recorded views loading timed out')), 30_000)
    }

    function snapshot () {
      if (!playback.hasFrame || !completeRef.current || reducedRef.current) return

      const canvas = overlayRef.current
      const context = canvas?.getContext('2d')

      if (!canvas || !context || !element?.videoWidth) return

      try {
        canvas.width = element.videoWidth
        canvas.height = element.videoHeight
        context.drawImage(element, 0, 0)
        clearTimeout(playback.fadeTimer)
        playback.holding = true
        setTransition('holding')
      } catch (error) {
        fail(error)
      }
    }

    function finishSeek () {
      if (signal.aborted || playback.blocked || !playback.busy || !element || element.seeking || element.readyState < 2) return

      cancelDecode()
      clearTimeout(playback.timeout)
      playback.busy = false
      playback.hasFrame = true
      playback.applied = element.currentTime
      playback.appliedPosition = playback.targetPosition
      setTime(playback.applied)
      setState('ready')

      if (playback.holding) {
        playback.holding = false
        if (reducedRef.current) clearTransition()
        else {
          setTransition('fading')
          playback.fadeTimer = setTimeout(clearTransition, 240)
        }
      }

      if (Math.abs(getVideoTime(playback.requested, video) - playback.applied) >= 0.5 / video.fps) seek(playback.requested)
    }

    function decoded () {
      if (signal.aborted || playback.blocked || !playback.busy || !element || element.seeking || element.readyState < 2) return

      cancelDecode()

      const version = playback.version
      const finishCurrentSeek = () => {
        if (version === playback.version) finishSeek()
      }

      if (typeof element.requestVideoFrameCallback === 'function') {
        playback.decodeRequest = element.requestVideoFrameCallback(finishCurrentSeek)
      }

      // Paused seeks may not schedule a video callback in every browser.
      playback.fallbackTimer = setTimeout(() => {
        if (version !== playback.version) return
        playback.frameRequest = requestAnimationFrame(() => {
          playback.frameRequest = requestAnimationFrame(finishCurrentSeek)
        })
      }, 100)
    }

    function seek (value: number) {
      playback.requested = clampVideoPosition(value)

      if (unavailable() || playback.busy || !element || element.readyState < 1) return

      const target = getVideoTime(playback.requested, video)

      if (playback.hasFrame && Math.abs(target - playback.applied) < 0.5 / video.fps) return

      if (crossesVideoCut(playback.applied, target, video.cuts)) snapshot()

      if (playback.blocked) return

      requestFrame(target)
    }

    function requestFrame (target: number) {
      if (!element) return

      cancelDecode()
      playback.busy = true
      playback.targetPosition = playback.requested
      watchTimeout()

      try {
        element.currentTime = target
        pollSeek()
      } catch (error) {
        fail(error)
      }
    }

    function pollSeek () {
      if (unavailable() || !playback.busy || !element) return

      if (!element.seeking && element.readyState >= 2) decoded()
      else playback.fallbackTimer = setTimeout(pollSeek, 50)
    }

    function unavailable () {
      return signal.aborted || playback.blocked
    }

    function metadata () {
      if (!element || signal.aborted || playback.blocked) return

      const aspectDifference = Math.abs(element.videoWidth / element.videoHeight / (image.width / image.height) - 1)

      if (!Number.isFinite(element.duration) || element.duration + 1 / video.fps < video.duration || aspectDifference > 0.01) {
        fail(new Error('Recorded views have incompatible dimensions or duration'))
        return
      }

      seek(playback.requested)
    }

    function loading () {
      if (!signal.aborted) setState('loading')
    }

    function cancelSeek () {
      cancelDecode()
      clearTimeout(playback.timeout)
      playback.busy = false
      playback.requested = playback.appliedPosition
      positionRef.current = playback.appliedPosition
      setPosition(playback.appliedPosition)
      clearTransition()
      if (!playback.hasFrame || !element) return
      try {
        element.currentTime = playback.applied
      } catch (error) {
        fail(error)
      }
    }

    clearTransition()
    cancelSeekRef.current = cancelSeek
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
      abortController.abort()
      cancelSeekRef.current = null
      seekRef.current = null
      clearTransitionRef.current = null
      cancelDecode()
      clearTimeout(playback.timeout)
      clearTimeout(playback.fadeTimer)
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

  const flushPosition = useCallback(() => {
    if (!pointerRequestRef.current) return
    cancelAnimationFrame(pointerRequestRef.current)
    pointerRequestRef.current = 0
    setPosition(positionRef.current)
    seekRef.current?.(positionRef.current)
  }, [])

  const cancelPosition = useCallback(() => {
    if (pointerRequestRef.current) cancelAnimationFrame(pointerRequestRef.current)
    pointerRequestRef.current = 0
    cancelSeekRef.current?.()
  }, [])

  const retry = () => setAttempt(value => value + 1)

  return { videoRef, overlayRef, frameRef: setFrameRef, positionRef, position, time, state, transition, interactive, updatePosition, resetView, flushPosition, cancelPosition, retry }
}

export default useTattooVideoPlayback
