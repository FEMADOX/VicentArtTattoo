import type { PointerEvent as ReactPointerEvent } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { TattooImage, TattooViewFrame, TattooViewSequence } from './ink-views'
import {
  getViewIndex,
  validateTattooSequence
} from './ink-views'

type ViewOptions = {
  sequence?: TattooViewSequence | undefined
  image: TattooImage
  visible: boolean
  interactive: boolean
  passive: boolean
}

type ViewState = {
  key: string
  frame: TattooViewFrame
  index: number
  ready: boolean
  loading: boolean
  error: string | null
}

type Drag = {
  id: number
  target: HTMLElement
  x: number
  width: number
  index: number
}

export function useTattooViews (options: ViewOptions) {
  const { image, sequence, visible, interactive, passive } = options
  const validation = sequence ? validateTattooSequence(image, sequence) : null
  const key = JSON.stringify([image.src, image.srcSet, image.sizes,
    image.width, image.height, sequence])
  const latest = useRef({ options, key, validation })
  useLayoutEffect(() => {
    latest.current = { options, key, validation }
  }, [options, key, validation])
  const [state, setState] = useState<ViewState>(() => ({
    key,
    frame: image,
    index: sequence?.referenceIndex ?? 0,
    ready: false,
    loading: false,
    error: validation
  }))
  const displayed = useRef({ key: state.key, index: state.index })
  useLayoutEffect(() => {
    displayed.current = { key: state.key, index: state.index }
  }, [state.key, state.index])
  const controller = useRef<{
    select: (index: number, isPassive?: boolean, isDrag?: boolean) => void
    freeze: (passiveOnly: boolean, dragOnly?: boolean) => void
  } | null>(null)
  const drag = useRef<Drag | null>(null)
  const raf = useRef<number | null>(null)
  const pending = useRef<{ index: number, passive: boolean } | null>(null)

  const cancelPointer = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current)
    raf.current = null
    pending.current = null
  }, [])

  const clearDrag = useCallback(() => {
    const current = drag.current
    drag.current = null
    if (current?.target.hasPointerCapture(current.id)) {
      current.target.releasePointerCapture(current.id)
    }
  }, [])

  useEffect(() => {
    const current = latest.current
    const { image: base, sequence: views } = current.options
    const reference = views?.referenceIndex ?? 0

    const update = (patch: Partial<ViewState>) => setState(previous => {
      const next = { ...previous, ...patch }
      return previous.key === next.key && previous.frame === next.frame &&
        previous.index === next.index && previous.ready === next.ready &&
        previous.loading === next.loading && previous.error === next.error
        ? previous
        : next
    })

    if (!visible || !views || current.validation) {
      if (current.key !== key) return
      setState(previous => ({
        ...previous,
        ...(previous.key !== key || current.validation
          ? { key, frame: base, index: reference }
          : {}),
        ready: false,
        loading: false,
        error: current.validation
      }))
      return
    }

    const abortController = new AbortController()
    const { signal } = abortController

    let failed = false
    let wanted = displayed.current.key === key ? displayed.current.index : reference
    let wantedPassive = false
    let wantedDrag = false
    let wantedInteractive = false
    const cache = new Map<number, HTMLImageElement>()
    const active = new Map<number, HTMLImageElement>()
    const decoded = new Set<number>()
    const queue = [wanted, ...views.frames.map((_, index) => index)
      .filter(index => index !== wanted)]

    const touch = (index: number, element: HTMLImageElement) => {
      cache.delete(index)
      cache.set(index, element)
      if (cache.size > 8) {
        const oldest = cache.keys().next().value
        if (oldest !== undefined) cache.delete(oldest)
      }
    }

    const show = (index: number) => {
      const current = latest.current
      if (!current.options.visible || current.key !== key) return
      if (wantedInteractive && !current.options.interactive) return
      if (wantedPassive && !current.options.passive) return
      const element = cache.get(index)
      if (!element) return
      touch(index, element)
      update({ key, index, frame: views.frames[index] })
    }

    const stop = () => {
      for (const element of active.values()) {
        element.removeAttribute('srcset')
        element.removeAttribute('src')
      }
      active.clear()
      cache.clear()
      queue.length = 0
    }

    const load = (index: number) => {
      const frame = views.frames[index]
      const element = new Image()
      active.set(index, element)
      element.decoding = 'async'
      if (base.sizes) element.sizes = base.sizes
      if (frame.srcSet) element.srcset = frame.srcSet
      element.src = frame.src
      void element.decode().then(() => {
        if (signal.aborted || failed) return
        if (!decodedDimensionsMatch(element, frame)) {
          throw new Error('The view image dimensions do not match the original.')
        }
        active.delete(index)
        touch(index, element)
        decoded.add(index)
        if (wanted === index) show(index)
        pump()
      }).catch(() => {
        if (signal.aborted || failed) return
        failed = true
        stop()
        update({
          key,
          frame: base,
          index: reference,
          ready: false,
          loading: false,
          error: 'Unable to load these views. The original photograph is shown.'
        })
      })
    }

    const pump = () => {
      if (signal.aborted || failed) return
      while (active.size < 2 && queue.length) {
        const index = queue.shift()
        if (index === undefined || active.has(index) || cache.has(index)) continue
        load(index)
      }
      update({
        ready: decoded.size === views.frames.length,
        loading: active.size > 0 || queue.length > 0
      })
    }

    const request = (index: number, isPassive?: boolean, isDrag?: boolean) => {
      if (signal.aborted || failed || !Number.isInteger(index) ||
        !views.frames[index]) return
      wanted = index
      wantedPassive = isPassive === true
      wantedDrag = isDrag === true
      wantedInteractive = true
      if (index === reference) update({ key, frame: base, index })
      if (cache.has(index)) show(index)
      else if (!active.has(index)) {
        const queued = queue.indexOf(index)
        if (queued !== -1) queue.splice(queued, 1)
        queue.unshift(index)
        pump()
      }
    }

    controller.current = {
      select: request,
      freeze: (passiveOnly, dragOnly) => {
        if (passiveOnly && !wantedPassive) return
        if (dragOnly && !wantedDrag) return
        // A late hover decode must not move the photo after motion preferences change.
        wanted = displayed.current.key === key ? displayed.current.index : reference
        wantedPassive = false
        wantedDrag = false
        wantedInteractive = false
      }
    }

    setState(previous => ({
      ...previous,
      ...(previous.key !== key ? { key, frame: base, index: reference } : {}),
      ready: false,
      loading: true,
      error: null
    }))

    pump()

    return () => {
      abortController.abort()
      controller.current = null
      cancelPointer()
      clearDrag()
      stop()
    }
  }, [key, visible, cancelPointer, clearDrag])

  useEffect(() => {
    if (!visible || !interactive) {
      cancelPointer()
      clearDrag()
      controller.current?.freeze(false)
    } else if (!passive) {
      if (pending.current?.passive) cancelPointer()
      controller.current?.freeze(true)
    }
  }, [visible, interactive, passive, cancelPointer, clearDrag])

  const select = useCallback((index: number) => {
    const current = latest.current
    if (!current.options.visible || !current.options.interactive ||
      !current.options.sequence || current.validation) return
    cancelPointer()
    controller.current?.select(index)
  }, [cancelPointer])

  const reset = useCallback(() => {
    cancelPointer()
    clearDrag()
    const current = latest.current
    const reference = current.options.sequence?.referenceIndex ?? 0
    controller.current?.select(reference)
    setState(previous => ({
      ...previous,
      key: current.key,
      frame: current.options.image,
      index: reference
    }))
  }, [cancelPointer, clearDrag])

  const queuePointer = useCallback((index: number, isPassive: boolean) => {
    pending.current = { index, passive: isPassive }
    if (raf.current !== null) return
    raf.current = requestAnimationFrame(() => {
      raf.current = null
      const next = pending.current
      pending.current = null
      const current = latest.current
      if (!next || !current.options.visible || !current.options.interactive ||
        (next.passive && !current.options.passive)) return
      controller.current?.select(next.index, next.passive, !next.passive)
    })
  }, [])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const current = latest.current
    if (event.pointerType === 'mouse' || !event.isPrimary ||
      !current.options.visible || !current.options.interactive ||
      !current.options.sequence || current.validation) return
    cancelPointer()
    const bounds = event.currentTarget.getBoundingClientRect()
    drag.current = {
      id: event.pointerId,
      target: event.currentTarget,
      x: event.clientX,
      width: bounds.width,
      index: state.key === current.key
        ? state.index
        : current.options.sequence.referenceIndex
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [cancelPointer, state.key, state.index])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const current = latest.current
    const views = current.options.sequence
    if (!views || current.validation || !current.options.visible ||
      !current.options.interactive) return
    if (event.pointerType === 'mouse') {
      if (!current.options.passive) return
      const bounds = event.currentTarget.getBoundingClientRect()
      queuePointer(getViewIndex(event.clientX - bounds.left,
        bounds.width, views.frames.length), true)
    } else if (drag.current?.id === event.pointerId) {
      const currentDrag = drag.current
      const x = (currentDrag.index + 0.5) * currentDrag.width /
        views.frames.length + event.clientX - currentDrag.x
      queuePointer(getViewIndex(x, currentDrag.width, views.frames.length), false)
    }
  }, [queuePointer])

  const finishPointer = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (drag.current?.id !== event.pointerId) return
    const next = pending.current
    if (next) select(next.index)
    clearDrag()
  }, [select, clearDrag])

  const cancelDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (drag.current?.id !== event.pointerId) return
    cancelPointer()
    clearDrag()
    controller.current?.freeze(false, true)
  }, [cancelPointer, clearDrag])

  const current = state.key === key
    ? state
    : {
        frame: image,
        index: sequence?.referenceIndex ?? 0,
        ready: false,
        loading: false,
        error: validation
      }
  return {
    frame: validation ? image : current.frame,
    index: current.index,
    valid: Boolean(sequence && !validation && !current.error),
    ready: current.ready,
    loading: current.loading,
    error: current.error,
    select,
    reset,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishPointer,
      onPointerCancel: cancelDrag,
      onLostPointerCapture: cancelDrag
    }
  }
}

function decodedDimensionsMatch (element: HTMLImageElement, frame: TattooViewFrame) {
  if (!element.naturalWidth || !element.naturalHeight) return false
  if (frame.srcSet) {
    return Math.abs(element.naturalWidth / element.naturalHeight -
      frame.width / frame.height) < 0.01
  }
  return element.naturalWidth === frame.width && element.naturalHeight === frame.height
}
