import { lazy, Suspense, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import * as motion from 'motion/react-m'
import MasonryGrid from './MasonryGrid'
import PortfolioPreview from './PortfolioRail'
import { ArrowDownLeft, ArrowLeft, ArrowRight, ExternalLink, Camera, UserRound, Mail, MapPin, MessageCircle } from 'lucide-react'
import { address, artworks, bookingChecklist, contactChannels } from './content'
import { cn } from '../lib/utils'
import { useDesignMotion } from './motion'
import { designStyles } from './styles'
import { Button } from '../components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { DesignDialog } from './DesignDialog'
import type { PortfolioWork } from './portfolio-works'

const TattooDrawReveal = lazy(async () => await import('./TattooDrawReveal'))
const InkDrawingExperience = lazy(async () => await import('./InkDrawingExperience'))

type ArtworkGalleryProps = {
  layout: 'a' | 'b' | 'c'
  ids?: readonly number[]
  preview?: boolean
  works?: readonly PortfolioWork[] | undefined
}

type ArtworkCardProps = {
  artwork: PortfolioWork
  index: number
  preview: boolean
  reveal: ReturnType<typeof useDesignMotion>['reveal']
  onOpen: (index: number, element: HTMLButtonElement) => void
}

function ArtworkCard ({ artwork, index, preview, reveal, onOpen }: ArtworkCardProps) {
  return (
    <motion.button
      {...(preview && index < 4 ? {} : reveal((index % 3) * 0.06))}
      type="button"
      className={cn(designStyles.artwork, preview && index < 4 && 'focus-visible:-outline-offset-2')}
      onClick={event => onOpen(index, event.currentTarget)}
      aria-haspopup="dialog"
      aria-label={(artwork.video ? 'Explore recorded views for piece ' : 'Enlarge piece ') + artwork.id + ': ' + artwork.alt}
    >
      <img className={designStyles.artworkImage} src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height} loading="lazy" decoding="async" />
      <span className={designStyles.artworkCaption}><span>{artwork.title ?? 'Piece ' + String(artwork.id).padStart(2, '0')}</span><span>{artwork.video ? 'Explore recorded views' : 'View full image'} <ArrowRight size={16} aria-hidden="true" /></span></span>
    </motion.button>
  )
}

function ArtworkLayout ({ layout, preview, cards }: { layout: ArtworkGalleryProps['layout'], preview: boolean, cards: ReactNode[] }) {
  if (preview) return <PortfolioPreview>{cards}</PortfolioPreview>
  if (layout === 'a') return <><div className={designStyles.galleryFeatured}>{cards.slice(0, 2)}</div><MasonryGrid>{cards.slice(2)}</MasonryGrid></>
  if (layout === 'c') return <MasonryGrid>{cards}</MasonryGrid>
  return <div className="grid grid-cols-2 items-start gap-14 [&>:nth-child(even)]:mt-24 max-[1000px]:gap-8 max-[720px]:grid-cols-1 max-[720px]:gap-6 max-[720px]:[&>:nth-child(even)]:mt-0">{cards}</div>
}

function getArtworkDialogBody (artwork: PortfolioWork, drawingActive: boolean) {
  if (artwork.video && artwork.drawingUrl) {
    return <Suspense fallback={<img className={designStyles.lightboxImage} src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height} />}><TattooDrawReveal key={artwork.id} image={artwork} video={artwork.video} drawingUrl={artwork.drawingUrl} playOnMount={false} inDialog /></Suspense>
  }
  if (drawingActive && artwork.drawing) return <Suspense fallback={<p role="status">Preparing drawing</p>}><InkDrawingExperience key={artwork.id} image={artwork} drawing={artwork.drawing} /></Suspense>
  return undefined
}

function ArtworkDialogControls ({ artwork, activeIndex, length, drawingActive, enabled, onDraw, onNavigate }: { artwork: PortfolioWork, activeIndex: number, length: number, drawingActive: boolean, enabled: boolean, onDraw: () => void, onNavigate: (index: number) => void }) {
  return (
    <div className="grid gap-3">
      {artwork.drawing && !drawingActive ? <Button variant="outline" onClick={onDraw} disabled={!enabled}>Play drawing</Button> : null}
      <div className={designStyles.lightboxControls}>
        <Button variant="outline" size="sm" className="justify-self-start" aria-label="Previous" disabled={activeIndex === 0} onClick={() => onNavigate(activeIndex - 1)}><ArrowLeft data-icon="inline-start" aria-hidden="true" /><span className="hidden min-[360px]:inline [@media(height<=500px)]:hidden">Previous</span></Button>
        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground tabular-nums">{activeIndex + 1} / {length}</span>
        <Button variant="outline" size="sm" className="justify-self-end" aria-label="Next" disabled={activeIndex === length - 1} onClick={() => onNavigate(activeIndex + 1)}><span className="hidden min-[360px]:inline [@media(height<=500px)]:hidden">Next</span><ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>
      </div>
    </div>
  )
}

function ArtworkDialog ({ artwork, activeIndex, length, drawingActive, open, enabled, body, onClose, onKeyDown, onDraw, onNavigate, returnFocusRef }: { artwork: PortfolioWork, activeIndex: number, length: number, drawingActive: boolean, open: boolean, enabled: boolean, body: ReactNode, onClose: () => void, onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void, onDraw: () => void, onNavigate: (index: number) => void, returnFocusRef: RefObject<HTMLButtonElement | null> }) {
  return (
    <DesignDialog title="Original tattoo work" image={artwork} caption={'Piece ' + artwork.id + ': ' + (artwork.title ?? artwork.alt)} body={body} open={open} onClose={onClose} onKeyDown={onKeyDown} returnFocusRef={returnFocusRef}>
      <ArtworkDialogControls artwork={artwork} activeIndex={activeIndex} length={length} drawingActive={drawingActive} enabled={enabled} onDraw={onDraw} onNavigate={onNavigate} />
    </DesignDialog>
  )
}

export function ArtworkGallery ({ layout, ids, preview = false, works }: ArtworkGalleryProps) {
  const collection: readonly PortfolioWork[] = works ?? (ids ? artworks.filter(artwork => ids.includes(artwork.id)) : artworks)
  const [activeIndex, setActiveIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [drawingActive, setDrawingActive] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const selected = collection.at(activeIndex)
  const { enabled, reveal } = useDesignMotion()

  function openArtwork (index: number, element: HTMLButtonElement) {
    trigger.current = element
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

  const cards = collection.map((artwork, index) => <ArtworkCard key={artwork.id} artwork={artwork} index={index} preview={preview} reveal={reveal} onOpen={openArtwork} />)
  const body = selected && open ? getArtworkDialogBody(selected, drawingActive) : undefined

  return (
    <>
      <ArtworkLayout layout={layout} preview={preview} cards={cards} />
      {selected && <ArtworkDialog artwork={selected} activeIndex={activeIndex} length={collection.length} drawingActive={drawingActive} open={open} enabled={enabled} body={body} onClose={close} onKeyDown={handleArrowKey} onDraw={() => setDrawingActive(true)} onNavigate={navigate} returnFocusRef={trigger} />}
    </>
  )
}

type BookingSectionProps = {
  id?: string
}

export function BookingSection ({ id = 'process' }: BookingSectionProps) {
  const { reveal } = useDesignMotion()
  return (
    <section id={id} className={cn(designStyles.section, 'border-y border-border bg-surface')} aria-labelledby="process-heading">
      <div className={designStyles.container}>
        {id !== 'process' ? <span id="process" className={designStyles.anchor} /> : null}
        <motion.header {...reveal()} className={designStyles.sectionIntro}>

          <h2 id="process-heading" className={designStyles.heading}>The studio process</h2>
          <p className={designStyles.copy}>I mostly work by appointment. Here is what to prepare and what to expect before booking.</p>
        </motion.header>
        <ol className="mb-16 grid list-none grid-cols-3 gap-10 p-0 [&_li>span]:mb-6 [&_li>span]:block [&_li>span]:text-2xl/[1.6] [&_li>span]:text-muted-foreground [&_li>span]:font-display [&_h3]:mb-3 [&_h3]:text-xl [&_p]:text-base [&_p]:leading-[1.8] [&_p]:text-(--design-muted) [@media(width<=720px)]:mb-10 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8 [@media(width<=720px)]:[&_li>span]:mb-2">
          <motion.li {...reveal()}><span>01</span><h3>Share your idea</h3><p>Send a description of your tattoo, desired size and placement, dates that work for you, and budget.</p></motion.li>
          <motion.li {...reveal(0.09)}><span>02</span><h3>Confirm your appointment</h3><p>A deposit is required and is included in your total price. Your appointment is confirmed once the deposit is received.</p></motion.li>
          <motion.li {...reveal(0.18)}><span>03</span><h3>See your design</h3><p>Each piece is designed before you arrive and shown to you on your appointment date.</p></motion.li>
        </ol>
        <div className="grid grid-cols-2 items-start gap-12 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8">
          <motion.div {...reveal()} id={id === 'booking' ? undefined : 'booking'} className={designStyles.panel}>
            <h3>Before you get in touch</h3>
            <p className={designStyles.copy}>Include these details in your first message.</p>
            <ul className={designStyles.checklist}>{bookingChecklist.map(item => <li key={item}><ArrowDownLeft aria-hidden="true" size={18} /><span>{item}</span></li>)}</ul>
          </motion.div>
          <div className="min-w-0">
            <h3 className="mb-4 text-2xl">Booking questions</h3>
            <Accordion type="multiple">
              <AccordionItem value="booking-1"><AccordionTrigger>When will I see my design?</AccordionTrigger><AccordionContent>Everything is designed before you arrive and shown to you on your appointment date.</AccordionContent></AccordionItem>
              <AccordionItem value="booking-2"><AccordionTrigger>How does the deposit work?</AccordionTrigger><AccordionContent>A deposit is required to confirm your appointment and is applied to the total price of your tattoo.</AccordionContent></AccordionItem>
              <AccordionItem value="booking-3"><AccordionTrigger>What if I need to change my appointment?</AccordionTrigger><AccordionContent>Deposits are non-refundable. A second deposit is required if you change your appointment day. Please be sure you can make it before booking.</AccordionContent></AccordionItem>
              <AccordionItem value="booking-4"><AccordionTrigger>Which payment methods are accepted?</AccordionTrigger><AccordionContent>Cash App, Zelle, Apple Pay and Venmo are used for payments. You can also stop by the shop and pay in cash.</AccordionContent></AccordionItem>
            </Accordion>
          </div>
        </div>
        <p className={cn(designStyles.policy, 'mt-10')}><strong>Before booking:</strong> Deposits are non-refundable. A second deposit is required to change your appointment day.</p>
      </div>
    </section>
  )
}

const channelIcons = { Instagram: Camera, Facebook: UserRound, Email: Mail, WhatsApp: MessageCircle }

type ContactSectionProps = {

  id?: string
  headingLevel?: 'h1' | 'h2'
  showChecklist?: boolean
  processHref?: string
}

export function ContactSection ({ id = 'contact', headingLevel = 'h2', showChecklist = headingLevel === 'h1', processHref = '#process' }: ContactSectionProps) {
  const Heading = headingLevel
  const { intro, reveal, hover } = useDesignMotion()
  return (
    <section id={id} className={cn(designStyles.section, 'group/contact')} aria-labelledby="contact-heading" data-checklist={showChecklist}>
      <div className={cn(designStyles.container, '[@media(width<=720px)]:group-data-[checklist=true]/contact:w-full')}>
        <motion.header {...(headingLevel === 'h1' ? intro() : reveal())} className={designStyles.sectionIntro}>

          <Heading id="contact-heading" className={cn(designStyles.heading, 'group-data-[checklist=true]/contact:text-[clamp(2.8rem,5vw,4.5rem)]')}>Contact the artist</Heading>
          <p className={designStyles.copy}>Choose how you would like to get in touch. I mostly work by appointment.</p>
        </motion.header>
        <div className="group-data-[checklist=true]/contact:grid group-data-[checklist=true]/contact:grid-cols-2 group-data-[checklist=true]/contact:gap-12 [@media(width<=1000px)]:group-data-[checklist=true]/contact:gap-6 [@media(width<=720px)]:group-data-[checklist=true]/contact:grid-cols-1 [@media(width<=720px)]:group-data-[checklist=true]/contact:gap-8">
          <div className="mb-8 [@media(width<=720px)]:mb-6 [@media(width<=720px)]:group-data-[checklist=true]/contact:mb-0">
            {showChecklist ? <motion.div {...reveal(0.1)} className={cn(designStyles.panel, 'mb-6')}><h2>Before you reach out</h2><p className={designStyles.copy}>Please include the following in your first message.</p><ul className={designStyles.checklist}>{bookingChecklist.map(item => <li key={item}><ArrowDownLeft aria-hidden="true" size={18} /><span>{item}</span></li>)}</ul></motion.div> : null}
            <div className={designStyles.policy}><strong>Appointment policy</strong><p>A deposit confirms your appointment and is applied to your total price. Deposits are non-refundable; a second deposit is required to change your appointment day.</p><a className={cn(designStyles.textLink, 'mt-2')} href={processHref}>Review the full studio process <ArrowRight size={16} aria-hidden="true" /></a></div>
          </div>
          <div className="grid grid-cols-2 items-start gap-12 group-data-[checklist=true]/contact:grid-cols-1 group-data-[checklist=true]/contact:gap-6 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8">
            <div className="grid gap-3">
              {contactChannels.map((channel, index) => {
                const Icon = channelIcons[channel.label]
                return <motion.a {...reveal(index * 0.07)} {...hover} key={channel.label} className="flex min-w-0 items-center gap-5 rounded-none border border-(--design-border) bg-surface p-5 text-foreground hover:border-input hover:bg-card [&>span]:min-w-0 [&>span]:flex-1 [&_strong]:block [&_strong]:text-base [&_strong]:font-normal [&>span>span]:mt-1 [&>span>span]:block [&>span>span]:text-sm [&>span>span]:text-(--design-muted) [&>span>span]:wrap-anywhere [@media(width<=720px)]:gap-3 [@media(width<=720px)]:p-4" href={channel.href}><Icon aria-hidden="true" size={24} /><span><strong>{channel.label}</strong><span>{channel.value}</span></span><ExternalLink size={18} aria-hidden="true" /></motion.a>
              })}
            </div>
            <motion.div {...reveal(0.12)} className="flex flex-col items-start gap-4 rounded-none border border-(--design-border) bg-surface p-9 [&_h3]:text-2xl/[1.2] [&_:is(address,p)]:text-base [&_:is(address,p)]:text-(--design-muted) [@media(width<=1000px)]:p-6"><MapPin size={28} aria-hidden="true" /><h3>New Port Richey</h3><address>{address}</address><p>Contact Vicent directly to discuss your idea and appointment.</p></motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
