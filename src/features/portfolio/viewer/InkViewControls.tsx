import { useId } from 'react'
import type { RefCallback } from 'react'
import { Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Slider from '@/components/ui/slider'
import type { TattooViewSequence } from '../utils/ink-views'
import type useTattooViews from './hooks/useTattooViews'

type Views = Pick<ReturnType<typeof useTattooViews>, 'index' | 'ready' | 'error' | 'select'>

function instructions (views: Views, active: boolean) {
  if (views.error) return views.error
  if (!views.ready) return 'Preparing other views. The original photograph remains available.'
  if (!active) return 'Other views will be available after the drawing finishes.'
  return 'Drag or use the Viewing angle slider to explore.'
}

type InkViewControlsProps = {
  sequence: TattooViewSequence | undefined
  views: Views
  active: boolean
  viewerOpen: boolean
}

export const InkViewControls = ({ sequence, views, active, viewerOpen }: InkViewControlsProps) => {
  const id = useId()
  if (!sequence) return null
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-xs text-body">
        <span id={id}>Viewing angle</span>
        <Slider className="min-w-0 flex-1" aria-labelledby={id} min={0} max={Math.max(1, sequence.frames.length - 1)} step={1} value={[views.index]} onValueChange={values => views.select(values[0])} disabled={!active || !views.ready || viewerOpen} aria-valuetext={'View ' + (views.index + 1) + ' of ' + sequence.frames.length} />
        <span aria-hidden="true" className="min-w-12 text-right tabular-nums">{views.index + 1} / {sequence.frames.length}</span>
      </div>
      <p className="font-mono text-xs text-muted-foreground" aria-live="polite" data-ink-views-status="">{instructions(views, active)}</p>
    </div>
  )
}

type InkEnlargeButtonProps = {
  multiple: boolean
  buttonRef: RefCallback<HTMLButtonElement>
  onClick: () => void
  statusId: string
  alt: string
}

export const InkEnlargeButton = ({ multiple, buttonRef, onClick, statusId, alt }: InkEnlargeButtonProps) => {
  if (multiple) {
    return <Button ref={buttonRef} variant="secondary" className="absolute right-3 bottom-3 z-4" onClick={onClick} onPointerDown={event => event.stopPropagation()} onPointerMove={event => event.stopPropagation()} aria-describedby={statusId}><Maximize2 data-icon="inline-start" aria-hidden="true" />Enlarge image</Button>
  }
  return (
    <button ref={buttonRef} type="button" className="absolute inset-0 z-4 cursor-zoom-in" onClick={onClick} aria-label={'View original: ' + alt} aria-describedby={statusId}>
      <span className="absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 border border-border bg-background/90 px-3 py-2 font-mono text-xs text-foreground" aria-hidden="true"><Maximize2 size={16} />View original</span>
    </button>
  )
}
