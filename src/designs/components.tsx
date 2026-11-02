import { useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import * as m from 'motion/react-m'
import MasonryGrid from './MasonryGrid'
import PortfolioPreview from './PortfolioRail'
import { useDesignMotion } from './motion'
import { ArrowDownLeft, ArrowLeft, ArrowRight, ExternalLink, Camera, UserRound, Mail, MapPin, MessageCircle, X } from 'lucide-react'
import { address, artworks, bookingChecklist, contactChannels } from './content'
import { cn } from '../lib/utils'
import { designStyles } from './styles'
import { Button } from '../components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'

export function DesignDialog ({ title, image, caption = image.alt, children, open, onClose, onKeyDown, returnFocusRef }: {
  title: string
  image: { src: string, alt: string, width: number, height: number }
  caption?: string
  children?: ReactNode
  open: boolean
  onClose: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}) {
  const { enabled } = useDesignMotion()
  return (
    <Dialog open={open} onOpenChange={next => { if (!next) onClose() }}>
      <DialogContent
        className={designStyles.lightbox}
        showCloseButton={false}
        onKeyDown={onKeyDown}
        onCloseAutoFocus={event => {
          event.preventDefault()
          returnFocusRef.current?.focus({ preventScroll: true })
        }}
      >
        <div className={designStyles.lightboxHeader}>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild><Button variant="ghost" size="icon" aria-label="Close dialog"><X aria-hidden="true" /></Button></DialogClose>
        </div>
        <DialogDescription className="sr-only">The complete original photograph. Press Escape or use Close dialog to return to the page.</DialogDescription>
        <div className={designStyles.lightboxFrame}>
          <m.img key={image.src} className={designStyles.lightboxImage} src={image.src} alt={image.alt} width={image.width} height={image.height} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: enabled ? 0.15 : 0 }} />
        </div>
        <div className={designStyles.lightboxFooter}>
          <p className={designStyles.lightboxCaption} aria-live="polite">{caption}</p>
          {children ?? <DialogClose asChild><Button variant="outline" className="justify-self-end">Close image</Button></DialogClose>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ArtworkGallery ({ layout, ids, preview = false }: { layout: 'a' | 'b' | 'c', ids?: readonly number[], preview?: boolean }) {
  const collection = ids ? artworks.filter(artwork => ids.includes(artwork.id)) : artworks
  const [activeIndex, setActiveIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const selected = collection.at(activeIndex)
  const { reveal } = useDesignMotion()

  function handleArrowKey (event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setActiveIndex(Math.min(activeIndex + 1, collection.length - 1))
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setActiveIndex(Math.max(activeIndex - 1, 0))
    }
  }

  const cards = collection.map((artwork, index) => (
    <m.button
      {...(preview && index < 4 ? {} : reveal((index % 3) * 0.06))}
      key={artwork.id}
      type="button"
      className={cn(designStyles.artwork, preview && index < 4 && 'focus-visible:-outline-offset-2')}
      onClick={event => {
        trigger.current = event.currentTarget
        setActiveIndex(index)
        setOpen(true)
      }}
      aria-haspopup="dialog"
      aria-label={'Enlarge piece ' + artwork.id + ': ' + artwork.alt}
    >
      <img className={designStyles.artworkImage} src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height} loading="lazy" decoding="async" />
      <span className={designStyles.artworkCaption}><span>Piece {String(artwork.id).padStart(2, '0')}</span><span>View full image <ArrowRight size={16} aria-hidden="true" /></span></span>
    </m.button>
  ))

  return (
    <>
      {preview
        ? <PortfolioPreview>{cards}</PortfolioPreview>
        : (
            <div className={layout === 'b' ? 'grid grid-cols-2 items-start gap-14 [&>:nth-child(even)]:mt-24 max-[1000px]:gap-8 max-[720px]:grid-cols-1 max-[720px]:gap-6 max-[720px]:[&>:nth-child(even)]:mt-0' : 'block'}>
              {layout === 'a' ? <><div className={designStyles.galleryFeatured}>{cards.slice(0, 2)}</div><MasonryGrid>{cards.slice(2)}</MasonryGrid></> : layout === 'c' ? <MasonryGrid>{cards}</MasonryGrid> : cards}
            </div>
          )}
      {selected && (
        <DesignDialog title="Original tattoo work" image={selected} caption={'Piece ' + selected.id + ': ' + selected.alt} open={open} onClose={() => setOpen(false)} onKeyDown={handleArrowKey} returnFocusRef={trigger}>
          <div className={designStyles.lightboxControls}>
            <Button variant="outline" size="sm" className="justify-self-start" aria-label="Previous" disabled={activeIndex === 0} onClick={() => setActiveIndex(activeIndex - 1)}><ArrowLeft data-icon="inline-start" aria-hidden="true" /><span className="hidden min-[360px]:inline [@media(height<=500px)]:hidden">Previous</span></Button>
            <span className="whitespace-nowrap font-mono text-xs text-muted-foreground tabular-nums">{activeIndex + 1} / {collection.length}</span>
            <Button variant="outline" size="sm" className="justify-self-end" aria-label="Next" disabled={activeIndex === collection.length - 1} onClick={() => setActiveIndex(activeIndex + 1)}><span className="hidden min-[360px]:inline [@media(height<=500px)]:hidden">Next</span><ArrowRight data-icon="inline-end" aria-hidden="true" /></Button>
          </div>
        </DesignDialog>
      )}
    </>
  )
}

export function BookingSection ({ id = 'process' }: { id?: string }) {
  const { reveal } = useDesignMotion()
  return (
    <section id={id} className={cn(designStyles.section, 'border-y border-border bg-surface')} aria-labelledby="process-heading">
      <div className={designStyles.container}>
        {id !== 'process' ? <span id="process" className={designStyles.anchor} /> : null}
        <m.header {...reveal()} className={designStyles.sectionIntro}>

          <h2 id="process-heading" className={designStyles.heading}>The studio process</h2>
          <p className={designStyles.copy}>I mostly work by appointment. Here is what to prepare and what to expect before booking.</p>
        </m.header>
        <ol className="mb-16 grid list-none grid-cols-3 gap-10 p-0 [&_li>span]:mb-6 [&_li>span]:block [&_li>span]:text-2xl/[1.6] [&_li>span]:text-muted-foreground [&_li>span]:font-display [&_h3]:mb-3 [&_h3]:text-xl [&_p]:text-base [&_p]:leading-[1.8] [&_p]:text-(--design-muted) [@media(width<=720px)]:mb-10 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8 [@media(width<=720px)]:[&_li>span]:mb-2">
          <m.li {...reveal()}><span>01</span><h3>Share your idea</h3><p>Send a description of your tattoo, desired size and placement, dates that work for you, and budget.</p></m.li>
          <m.li {...reveal(0.09)}><span>02</span><h3>Confirm your appointment</h3><p>A deposit is required and is included in your total price. Your appointment is confirmed once the deposit is received.</p></m.li>
          <m.li {...reveal(0.18)}><span>03</span><h3>See your design</h3><p>Each piece is designed before you arrive and shown to you on your appointment date.</p></m.li>
        </ol>
        <div className="grid grid-cols-2 items-start gap-12 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8">
          <m.div {...reveal()} id={id === 'booking' ? undefined : 'booking'} className={designStyles.panel}>
            <h3>Before you get in touch</h3>
            <p className={designStyles.copy}>Include these details in your first message.</p>
            <ul className={designStyles.checklist}>{bookingChecklist.map(item => <li key={item}><ArrowDownLeft aria-hidden="true" size={18} /><span>{item}</span></li>)}</ul>
          </m.div>
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

export function ContactSection ({ id = 'contact', headingLevel = 'h2', showChecklist = headingLevel === 'h1', processHref = '#process' }: {
  id?: string
  headingLevel?: 'h1' | 'h2'
  showChecklist?: boolean
  processHref?: string
}) {
  const Heading = headingLevel
  const { intro, reveal, hover } = useDesignMotion()
  return (
    <section id={id} className={cn(designStyles.section, 'group/contact')} aria-labelledby="contact-heading" data-checklist={showChecklist}>
      <div className={cn(designStyles.container, '[@media(width<=720px)]:group-data-[checklist=true]/contact:w-full')}>
        <m.header {...(headingLevel === 'h1' ? intro() : reveal())} className={designStyles.sectionIntro}>

          <Heading id="contact-heading" className={cn(designStyles.heading, 'group-data-[checklist=true]/contact:text-[clamp(2.8rem,5vw,4.5rem)]')}>Contact the artist</Heading>
          <p className={designStyles.copy}>Choose how you would like to get in touch. I mostly work by appointment.</p>
        </m.header>
        <div className="group-data-[checklist=true]/contact:grid group-data-[checklist=true]/contact:grid-cols-2 group-data-[checklist=true]/contact:gap-12 [@media(width<=1000px)]:group-data-[checklist=true]/contact:gap-6 [@media(width<=720px)]:group-data-[checklist=true]/contact:grid-cols-1 [@media(width<=720px)]:group-data-[checklist=true]/contact:gap-8">
          <div className="mb-8 [@media(width<=720px)]:mb-6 [@media(width<=720px)]:group-data-[checklist=true]/contact:mb-0">
            {showChecklist ? <m.div {...reveal(0.1)} className={cn(designStyles.panel, 'mb-6')}><h2>Before you reach out</h2><p className={designStyles.copy}>Please include the following in your first message.</p><ul className={designStyles.checklist}>{bookingChecklist.map(item => <li key={item}><ArrowDownLeft aria-hidden="true" size={18} /><span>{item}</span></li>)}</ul></m.div> : null}
            <div className={designStyles.policy}><strong>Appointment policy</strong><p>A deposit confirms your appointment and is applied to your total price. Deposits are non-refundable; a second deposit is required to change your appointment day.</p><a className={cn(designStyles.textLink, 'mt-2')} href={processHref}>Review the full studio process <ArrowRight size={16} aria-hidden="true" /></a></div>
          </div>
          <div className="grid grid-cols-2 items-start gap-12 group-data-[checklist=true]/contact:grid-cols-1 group-data-[checklist=true]/contact:gap-6 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8">
            <div className="grid gap-3">
              {contactChannels.map((channel, index) => {
                const Icon = channelIcons[channel.label]
                return <m.a {...reveal(index * 0.07)} {...hover} key={channel.label} className="flex min-w-0 items-center gap-5 rounded-none border border-(--design-border) bg-surface p-5 text-foreground hover:border-input hover:bg-card [&>span]:min-w-0 [&>span]:flex-1 [&_strong]:block [&_strong]:text-base [&_strong]:font-normal [&>span>span]:mt-1 [&>span>span]:block [&>span>span]:text-sm [&>span>span]:text-(--design-muted) [&>span>span]:wrap-anywhere [@media(width<=720px)]:gap-3 [@media(width<=720px)]:p-4" href={channel.href}><Icon aria-hidden="true" size={24} /><span><strong>{channel.label}</strong><span>{channel.value}</span></span><ExternalLink size={18} aria-hidden="true" /></m.a>
              })}
            </div>
            <m.div {...reveal(0.12)} className="flex flex-col items-start gap-4 rounded-none border border-(--design-border) bg-surface p-9 [&_h3]:text-2xl/[1.2] [&_:is(address,p)]:text-base [&_:is(address,p)]:text-(--design-muted) [@media(width<=1000px)]:p-6"><MapPin size={28} aria-hidden="true" /><h3>New Port Richey</h3><address>{address}</address><p>Contact Vicent directly to discuss your idea and appointment.</p></m.div>
          </div>
        </div>
      </div>
    </section>
  )
}
