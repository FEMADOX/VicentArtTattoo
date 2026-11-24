import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import type { PointerEvent } from 'react'

type AngleDragOptions = {
  enabled: boolean
  onStart: () => void
  onChange: (deltaX: number, width: number) => void
  onEnd: () => void
  onCancel: () => void
}

type DragSession = {
  id: number
  target: HTMLElement
  x: number
  y: number
  width: number
  dragging: boolean
}

function useAngleDrag (options: AngleDragOptions) {
  const latest = useRef(options)
  const session = useRef<DragSession | null>(null)
  useLayoutEffect(() => {
    latest.current = options
  }, [options])

  const release = useCallback(() => {
    const current = session.current
    session.current = null
    if (current?.target.hasPointerCapture(current.id)) current.target.releasePointerCapture(current.id)
    return current
  }, [])

  const cancel = useCallback(() => {
    if (release()?.dragging) latest.current.onCancel()
  }, [release])

  useEffect(() => {
    if (!options.enabled) cancel()
  }, [options.enabled, cancel])
  useEffect(() => cancel, [cancel])

  function onPointerDown (event: PointerEvent<HTMLElement>) {
    if (!latest.current.enabled || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
    cancel()
    session.current = { id: event.pointerId, target: event.currentTarget, x: event.clientX, y: event.clientY, width: event.currentTarget.getBoundingClientRect().width, dragging: false }
    latest.current.onStart()
  }

  function onPointerMove (event: PointerEvent<HTMLElement>) {
    const current = session.current
    if (!current || current.id !== event.pointerId || !latest.current.enabled) return
    const deltaX = event.clientX - current.x
    const deltaY = event.clientY - current.y
    if (!current.dragging) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        cancel()
        return
      }
      current.dragging = true
      if (event.pointerType === 'mouse') current.target.setPointerCapture(current.id)
    }
    event.preventDefault()
    latest.current.onChange(deltaX, current.width)
  }

  function onPointerUp (event: PointerEvent<HTMLElement>) {
    if (session.current?.id !== event.pointerId) return
    if (release()?.dragging) latest.current.onEnd()
  }

  function onPointerCancel (event: PointerEvent<HTMLElement>) {
    if (session.current?.id !== event.pointerId) return
    const current = session.current
    session.current = null
    if (current.dragging) latest.current.onCancel()
  }

  return { cancel, pointerHandlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture: onPointerCancel } }
}

export default useAngleDrag
