import { lazy, Suspense, useState } from 'react'
import type { KeyboardEvent } from 'react'
import * as motion from 'motion/react-m'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import PortfolioPreview from './PortfolioRail'
import artworks from './data/artworks'
import cn from '@/lib/utils'
import { useSiteMotion } from '@/motion/useSiteMotion'
import portfolioStyles from './styles'
import { Button } from '@/components/ui/button'
import ArtworkDialog from './ArtworkDialog'
import type { PortfolioWork } from './data/portfolio-works'

const TattooDrawReveal = lazy(async () => await import('./viewer/TattooDrawReveal'))

type ArtworkGalleryProps = {
  works?: readonly PortfolioWork[] | undefined
}

type ArtworkCardProps = {
  artwork: PortfolioWork
  index: number
  reveal: ReturnType<typeof useSiteMotion>['reveal']
  onOpen: (index: number, element: HTMLButtonElement) => void
}

const ArtworkCard = ({ artwork, index, reveal, onOpen }: ArtworkCardProps) =>
  (
    <motion.button
      {...(index < 4 ? {} : reveal((index % 3) * 0.06))}
      type="button"
      className={cn(portfolioStyles.artwork, index < 4 && 'focus-visible:-outline-offset-2')}
      onClick={event => onOpen(index, event.currentTarget)}
      aria-haspopup="dialog"
      aria-label={(artwork.video ? 'Explore recorded views for piece ' : 'Enlarge piece ') + artwork.id + ': ' + artwork.alt}
    >
      <img className={portfolioStyles.artworkImage} src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height} loading="lazy" decoding="async" />
      <span className={portfolioStyles.artworkCaption}><span>{artwork.title ?? 'Piece ' + String(artwork.id).padStart(2, '0')}</span><span>{artwork.video ? 'Explore recorded views' : 'View full image'} <ArrowRight size={16} aria-hidden="true" /></span></span>
    </motion.button>
  )

function getArtworkDialogBody (artwork: PortfolioWork, drawingActive: boolean) {
  if (!artwork.video && !drawingActive) return undefined

  const fallback = artwork.video
    ? <img className={portfolioStyles.lightboxImage} src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height} />
    : <p role="status">Preparing drawing</p>

  return <Suspense fallback={fallback}><TattooDrawReveal key={artwork.id} image={artwork} video={artwork.video} drawingUrl={artwork.drawingUrl} playOnMount={drawingActive} inDialog /></Suspense>
}

type ArtworkDialogControlsProps = {
  artwork: PortfolioWork
  activeIndex: number
  length: number
  drawingActive: boolean
  enabled: boolean
  onDraw: () => void
  onNavigate: (index: number) => void
}

const ArtworkDialogControls = ({ artwork, activeIndex, length, drawingActive, enabled, onDraw, onNavigate }: ArtworkDialogControlsProps) =>
  (
    <div className="grid gap-3">
      {!artwork.video && !drawingActive ? <Button variant="outline" onClick={onDraw} disabled={!enabled}>Play drawing</Button> : null}
      <div className={portfolioStyles.lightboxControls}>
        <Button variant="outline" size="sm" className="justify-self-start" aria-label="Previous" disabled={activeIndex === 0} onClick={() => onNavigate(activeIndex - 1)}><ArrowLeft data-icon="inline-start" aria-hidden="true" /><span className="hidden min-[360px]:inline [@media(height<=500px)]:hidden">Previous</span></Button>
        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground tabular-nums">{activeIndex + 1} / {length}</span>
        <Button variant="outline" size="sm" className="justify-self-end" aria-label="Next" disabled={activeIndex === length - 1} onClick={() => onNavigate(activeIndex + 1)}><span className="hidden min-[360px]:inline [@media(height<=500px)]:hidden">Next</span><ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>
      </div>
    </div>
  )

const ArtworkGallery = ({ works }: ArtworkGalleryProps) => {
  const collection: readonly PortfolioWork[] = works ?? artworks
  const [activeIndex, setActiveIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [drawingActive, setDrawingActive] = useState(false)
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const selected = collection.at(activeIndex)
  const { enabled, reveal } = useSiteMotion()

  function openArtwork (index: number, element: HTMLButtonElement) {
    setTrigger(element)
    setActiveIndex(index)
    setDrawingActive(false)
    setOpen(true)
  }

  function navigate (index: number) {
    setActiveIndex(index)
    setDrawingActive(false)
  }

  function handleArrowKey (event: KeyboardEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest('[role="slider"]')) return
    if (event.key === 'ArrowRight' && activeIndex < collection.length - 1) {
      event.preventDefault()
      navigate(activeIndex + 1)
    } else if (event.key === 'ArrowLeft' && activeIndex > 0) {
      event.preventDefault()
      navigate(activeIndex - 1)
    }
  }

  function close () {
    setOpen(false)
    setDrawingActive(false)
  }

  const cards = collection.map((artwork, index) => <ArtworkCard key={artwork.id} artwork={artwork} index={index} reveal={reveal} onOpen={openArtwork} />)
  const body = selected && open ? getArtworkDialogBody(selected, drawingActive) : undefined

  return (
    <>
      <PortfolioPreview>{cards}</PortfolioPreview>
      {selected && (
        <ArtworkDialog title="Original tattoo work" image={selected} caption={'Piece ' + selected.id + ': ' + (selected.title ?? selected.alt)} actions={<ArtworkDialogControls artwork={selected} activeIndex={activeIndex} length={collection.length} drawingActive={drawingActive} enabled={enabled} onDraw={() => setDrawingActive(true)} onNavigate={navigate} />} open={open} onClose={close} onKeyDown={handleArrowKey} returnFocus={() => trigger?.focus({ preventScroll: true })}>
          {body}
        </ArtworkDialog>
      )}
    </>
  )
}

export default ArtworkGallery
