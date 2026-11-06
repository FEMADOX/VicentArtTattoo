import * as m from 'motion/react-m'
import { ArtworkGallery, BookingSection, ContactSection } from './components'
import { address, artistImage, artworks, biography, philosophy } from './content'
import { useDesignMotion } from './motion'
import { cn } from '../lib/utils'
import { designStyles } from './styles'
import { Button } from '../components/ui/button'

const smallCopy = 'text-base leading-relaxed text-muted-foreground'
const displayTitle = 'mb-2 text-[clamp(2.5rem,4.2vw,4.5rem)] leading-[1.1] font-normal tracking-wide uppercase text-foreground font-display [@media(width<=640px)]:text-[clamp(2rem,8.5vw,2.75rem)]'
const factLabels = '[&_dt]:text-xs [&_dt]:tracking-[0.06em] [&_dt]:text-muted-foreground [&_dt]:uppercase [&_dd]:mx-0 [&_dd]:mt-1 [&_dd]:mb-0 [&_dd]:text-xs [&_dd]:leading-[1.6]'

const styles = {
  main: 'pb-36 [@media(width<=640px)]:pb-16',
  hero: 'grid grid-cols-[1.15fr_0.95fr] items-center gap-[clamp(3rem,9vw,10rem)] pt-24 pb-28 [@media(width<=1000px)]:gap-12 [@media(width<=1000px)]:pt-16 [@media(width<=1000px)]:pb-20 [@media(width<=640px)]:grid-cols-1 [@media(width<=640px)]:gap-6 [@media(width<=640px)]:pt-6 [@media(width<=640px)]:pb-14',
  heroTitle: displayTitle,
  pageTitle: cn(displayTitle, 'mb-4'),
  heroCopy: '[&>p:last-of-type]:mt-7 [&>p:last-of-type]:mb-8 [&>p:last-of-type]:max-w-136 [@media(width<=640px)]:[&>p:last-of-type]:mt-4 [@media(width<=640px)]:[&>p:last-of-type]:mb-6 [@media(width<=640px)]:[&>p:last-of-type]:text-sm [@media(width<=640px)]:[&>div>a]:flex-1 [@media(width<=640px)]:[&>div>a]:px-3 [@media(width<=640px)]:[&>div>a]:text-center [@media(width<=640px)]:[&>div>a]:text-xs',
  locationTag: 'mb-4 font-mono text-xs text-muted-foreground',
  artistRole: 'mb-3 text-2xl/[1.6] font-display [@media(width<=640px)]:text-lg',
  heroAddress: cn(smallCopy, '[@media(width<=640px)]:text-xs'),
  artistMeta: cn(smallCopy, '[@media(width<=640px)]:text-xs'),
  address: cn(smallCopy, 'mb-0 border-t border-border pt-4 text-xs [@media(width<=640px)]:w-full'),
  smallCopy: cn(smallCopy, 'text-xs'),
  linkDescription: cn(smallCopy, 'text-xs'),
  actions: 'flex flex-wrap items-center gap-4 [@media(width<=640px)]:gap-3',
  heroFacts: cn(factLabels, 'mt-6 grid grid-cols-2 gap-6 border-t border-border pt-4 [@media(width<=640px)]:hidden'),
  heroArtwork: 'relative block rounded-none border border-border bg-surface p-3 [&>img]:block [&_img]:h-auto [&>img]:w-full [&>img]:rounded-none [&>img]:bg-black [&>img]:object-contain [@media(width<=1000px)]:[&_img]:h-auto [@media(width<=640px)]:rounded-none [@media(width<=640px)]:p-2 [@media(width<=640px)]: [@media(width<=640px)]:[&>img]:h-auto [@media(width<=640px)]:[&>img]:max-h-132',
  featureCaption: 'mt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted-foreground [&_strong]:block [&_strong]:font-normal [&>span:first-child>span]:block [&>span:last-child]:underline',
  sectionHeader: 'mb-8 flex items-end justify-between gap-6 border-b border-border pb-5 [&_h2]:mb-1 [&_p:not(:first-child)]:mb-0 [&>a]:mb-1 [&>a]:whitespace-nowrap [@media(width<=640px)]:mb-4 [@media(width<=640px)]:items-start [@media(width<=640px)]:gap-3 [@media(width<=640px)]:border-t [@media(width<=640px)]:border-b-0 [@media(width<=640px)]:border-t-border [@media(width<=640px)]:py-3 [@media(width<=640px)]:[&_h2]:text-2xl [@media(width<=640px)]:[&_p:not(:first-child)]:mt-4 [@media(width<=640px)]:[&_p:not(:first-child)]:text-xs [@media(width<=640px)]:[&>a]:pt-4 [@media(width<=640px)]:[&>a]:text-xs',
  eyebrow: 'mb-2 text-xs tracking-widest text-muted-foreground uppercase [@media(width<=640px)]:text-xs [@media(width<=640px)]:tracking-[0.07em]',
  previewGrid: 'grid grid-cols-[1.4fr_1fr] grid-rows-2 gap-6 [@media(width<=640px)]:grid-cols-2 [@media(width<=640px)]:grid-rows-[auto] [@media(width<=640px)]:gap-3',
  previewArtwork: 'flex min-w-0 flex-col rounded-none border border-border bg-surface p-3 text-inherit no-underline [@media(width<=640px)]:p-2',
  leadArtwork: 'row-span-2 [@media(width<=640px)]:col-span-full [@media(width<=640px)]:row-auto',
  previewImage: 'flex min-h-0 flex-1 items-center justify-center rounded-none bg-black',
  previewCaption: 'flex items-center justify-between gap-4 px-1 pt-4 pb-1 text-xs text-muted-foreground [@media(width<=640px)]:gap-2 [@media(width<=640px)]:px-0 [@media(width<=640px)]:pt-3 [@media(width<=640px)]:pb-1 [@media(width<=640px)]:text-xs',
  previewAction: 'text-body underline underline-offset-[3px]',
  artistPreview: 'my-28 grid grid-cols-[0.85fr_1.35fr] items-center gap-20 rounded-none border border-border bg-surface px-20 py-12 [&>div:first-child]:py-12 [@media(width<=1000px)]:gap-12 [@media(width<=1000px)]:p-8 [@media(width<=640px)]:my-12 [@media(width<=640px)]:flex [@media(width<=640px)]:flex-col [@media(width<=640px)]:gap-4 [@media(width<=640px)]:rounded-none [@media(width<=640px)]:border-0 [@media(width<=640px)]:bg-transparent [@media(width<=640px)]:p-0 [@media(width<=640px)]:[&>div:first-child]:w-full [@media(width<=640px)]:[&>div:first-child]:py-2',
  portraitFrame: 'overflow-hidden rounded-none border border-border bg-black p-2 [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:rounded-none [&_img]:object-contain',
  artistPreviewCopy: '[&>p:last-of-type]:mt-6 [&>p:last-of-type]:mb-8 [@media(width<=640px)]:rounded-none [@media(width<=640px)]:border [@media(width<=640px)]:border-border [@media(width<=640px)]:bg-surface [@media(width<=640px)]:p-4 [@media(width<=640px)]:[&>p:last-of-type]:mt-4 [@media(width<=640px)]:[&>p:last-of-type]:mb-6 [@media(width<=640px)]:[&>p:last-of-type]:text-sm [@media(width<=640px)]:[&>div]:justify-center [@media(width<=640px)]:[&>div]:text-center [@media(width<=640px)]:[&>div>a]:w-full',
  bookingPreview: 'mx-auto mb-28 max-w-3xl [@media(width<=640px)]:mb-14',
  centerHeading: 'mx-auto mb-8 max-w-176 text-center [@media(width<=640px)]:mb-4 [@media(width<=640px)]:border-t [@media(width<=640px)]:border-border [@media(width<=640px)]:pt-3 [@media(width<=640px)]:[&_h2]:text-2xl [@media(width<=640px)]:[&_p:last-child]:text-sm',
  checklistPanel: 'rounded-none border border-border bg-surface p-8 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:leading-normal [@media(width<=640px)]:p-4',
  checklist: 'mt-4 grid list-none grid-cols-2 gap-3 border-t border-border px-0 py-5 [counter-reset:initial-detail] [&_li]:flex [&_li]:gap-3 [&_li]:rounded-none [&_li]:border [&_li]:border-border [&_li]:bg-card [&_li]:p-4 [&_li]:text-xs [&_li]:[counter-increment:initial-detail] [&_li]:before:grid [&_li]:before:h-5 [&_li]:before:flex-[0_0_1.25rem] [&_li]:before:place-items-center [&_li]:before:rounded-full [&_li]:before:bg-accent [&_li]:before:text-xs [&_li]:before:text-body [&_li]:before:content-[counter(initial-detail)] [&_li_p]:mt-1 [&_li_p]:text-xs [&_li_p]:leading-normal [&_li_p]:text-muted-foreground [@media(width<=640px)]:grid-cols-1 [@media(width<=640px)]:gap-2 [@media(width<=640px)]:py-4 [@media(width<=640px)]:[&_li]:p-3',
  checklistFoot: 'flex items-center gap-5 border-t border-border pt-4 [&_p]:m-0 [&_p]:flex-1 [&_p]:text-xs [&_p]:leading-normal [&_p]:text-muted-foreground [&_a]:text-xs [&_a]:whitespace-nowrap [@media(width<=640px)]:flex-wrap [@media(width<=640px)]:justify-between [@media(width<=640px)]:gap-4 [@media(width<=640px)]:[&_p]:basis-full',
  contactEntry: 'flex flex-col items-center gap-6 rounded-none border border-border bg-surface p-12 text-center [&>div]:max-w-xl [&>div>p:last-child]:mb-0 [@media(width<=640px)]:rounded-none [@media(width<=640px)]:px-5 [@media(width<=640px)]:py-7 [@media(width<=640px)]:[&_h2]:text-3xl [@media(width<=640px)]:[&>div>p:last-child]:text-sm [@media(width<=640px)]:[&>a]:w-full [@media(width<=640px)]:[&>a]:text-center',
  pageHeader: 'mb-16 flex items-end justify-between gap-12 border-b border-border pt-16 pb-12 [&>div]:max-w-180 [&>div>p:last-child]:mb-0 [@media(width<=1000px)]:flex-col [@media(width<=1000px)]:items-start [@media(width<=1000px)]:gap-6 [@media(width<=640px)]:mb-8 [@media(width<=640px)]:gap-5 [@media(width<=640px)]:py-8 [@media(width<=640px)]:[&>div>p:last-child]:text-sm',
  collectionCount: 'text-xs whitespace-nowrap text-muted-foreground [&_strong]:mr-2 [&_strong]:text-body [@media(width<=640px)]:mb-0 [@media(width<=640px)]:text-xs',
  portfolioClosing: 'mt-20 grid grid-cols-[1.4fr_1fr] gap-8 border-t border-border pt-8 [@media(width<=1000px)]:grid-cols-2 [@media(width<=640px)]:mt-12 [@media(width<=640px)]:grid-cols-1 [@media(width<=640px)]:gap-6',
  compactEntry: 'items-start justify-center bg-surface p-10 text-left [&>p]:w-full [@media(width<=1000px)]:p-6 [@media(width<=640px)]:items-center [@media(width<=640px)]:px-5 [@media(width<=640px)]:py-7 [@media(width<=640px)]:text-center',
  artistCard: 'rounded-none border border-border bg-surface p-10 [@media(width<=1000px)]:p-6 [@media(width<=640px)]:[&>p]:text-sm',
  artistCardHeading: 'mb-8 flex items-center gap-5 [&_img]:size-20 [&_img]:rounded-none [&_img]:bg-black [&_img]:object-contain [&_h2]:mb-1 [&_h2]:text-2xl [&_p]:mb-0',
  artistCardFoot: 'mt-10 flex justify-between gap-6 border-t border-border pt-6 text-xs text-muted-foreground [@media(width<=640px)]:mt-6 [@media(width<=640px)]:leading-normal',
  sectionNavigation: 'mb-4 flex flex-wrap gap-3',
  biography: 'grid scroll-mt-28 grid-cols-2 items-start gap-16 [@media(width<=1000px)]:gap-8 [@media(width<=640px)]:grid-cols-1 [@media(width<=640px)]:gap-6 [@media(width<=640px)]:rounded-none [@media(width<=640px)]:border [@media(width<=640px)]:border-border [@media(width<=640px)]:bg-surface [@media(width<=640px)]:p-4',
  portraitCaption: cn(smallCopy, 'mb-0 px-2 pt-4 pb-2 text-xs'),
  artistFacts: cn(factLabels, 'mt-4 grid grid-cols-3 gap-3 [&>div]:rounded-none [&>div]:border [&>div]:border-border [&>div]:bg-surface [&>div]:p-3 [@media(width<=1000px)]:grid-cols-2 [@media(width<=1000px)]:[&>div:last-child]:col-span-full [@media(width<=640px)]:[&>div]:bg-card [@media(width<=640px)]:[&>div]:p-3 [@media(width<=640px)]:[&_dt]:text-xs [@media(width<=640px)]:[&_dd]:text-xs'),
  biographyCopy: 'pt-2 [&>p:last-of-type]:my-6 [@media(width<=640px)]:[&>p:last-of-type]:my-4 [@media(width<=640px)]:[&>p:last-of-type]:text-sm [@media(width<=640px)]:[&_h2]:text-3xl',
  discussNote: 'mt-6 mb-8 rounded-none border-l border-input bg-surface p-4 text-xs [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-normal [&_p]:text-muted-foreground [@media(width<=640px)]:my-4 [@media(width<=640px)]:bg-card',
  philosophy: 'my-24 scroll-mt-28 rounded-none border border-border bg-surface p-12 [&_blockquote]:my-8 [&_blockquote]:max-w-4xl [&_blockquote]:border-l [&_blockquote]:border-input [&_blockquote]:pl-5 [&_blockquote]:text-2xl [&_blockquote]:leading-[1.55] [&_blockquote]:text-foreground [&_blockquote]:font-display [&>p:last-child]:mb-0 [&>p:last-child]:max-w-264 [@media(width<=640px)]:my-8 [@media(width<=640px)]:rounded-none [@media(width<=640px)]:bg-surface [@media(width<=640px)]:p-5 [@media(width<=640px)]:[&_blockquote]:my-6 [@media(width<=640px)]:[&_blockquote]:pl-4 [@media(width<=640px)]:[&_blockquote]:text-lg [@media(width<=640px)]:[&>p:last-child]:text-sm',
  bookingFull: 'mb-24 [@media(width<=640px)]:mb-12',
  contactPage: 'pt-16 [@media(width<=640px)]:pt-8',
  contactArtist: 'mt-12 ml-auto flex max-w-2xl items-center gap-6 rounded-none border border-border bg-surface p-5 [&>img]:h-auto [&>img]:w-32 [&>img]:flex-[0_0_8rem] [&>img]:rounded-none [&>img]:object-contain [&_h2]:text-2xl/[1.2] [&>div>p:last-of-type]:text-xs [&>div>p:last-of-type]:leading-[1.6] [&_a]:text-xs [@media(width<=640px)]:mt-8 [@media(width<=640px)]:items-start [@media(width<=640px)]:gap-4 [@media(width<=640px)]:p-4 [@media(width<=640px)]:[&>img]:w-20 [@media(width<=640px)]:[&>img]:basis-20 [@media(width<=640px)]:[&>div>p:first-child]:text-xs [@media(width<=640px)]:[&_h2]:text-xl [@media(width<=640px)]:[&>div>p:last-of-type]:text-xs',
  contactWork: 'mt-20 border-t border-border pt-12 [@media(width<=640px)]:mt-12 [@media(width<=640px)]:border-0 [@media(width<=640px)]:pt-4 [@media(width<=640px)]:[&>div>div>h2]:text-xl',
  contactPreviewGrid: 'grid grid-cols-4 gap-4 [&_img]:h-auto [&>a>span:last-child]:justify-center [&>a>span:last-child>span:last-child]:hidden [@media(width<=1000px)]:grid-cols-2 [@media(width<=640px)]:grid-cols-1 [@media(width<=640px)]:[&>a:nth-child(n+3)]:hidden [@media(width<=640px)]:[&_img]:h-auto'
}

const routes = {
  home: '/designs/c',
  portfolio: '/designs/c/portfolio',
  about: '/designs/c/about',
  contact: '/designs/c/contact'
}

const initialDetails = [
  ['Idea description', 'Concept, style preference, and any references.'],
  ['Size & placement', 'Approximate dimensions and placement on your body.'],
  ['Availability', 'Days of the week or specific dates that fit your schedule.'],
  ['Budget', 'Your intended budget range for the piece.']
]

function ContactLink () {
  const { hover } = useDesignMotion()

  return <Button asChild><m.a {...hover} href={routes.contact}>Contact the artist</m.a></Button>
}

function ContactEntry ({ compact = false }: { compact?: boolean }) {
  const { reveal } = useDesignMotion()

  return (
    <section className={cn(styles.contactEntry, compact && styles.compactEntry)}>
      <m.div {...reveal()}>

        <h2 className={designStyles.heading}>Ready to discuss your project?</h2>
        <p className={designStyles.copy}>
          Reach out directly to submit your ideas, discuss scheduling, and review
          appointment requirements with Vicent.
        </p>
      </m.div>
      <ContactLink />
      <m.p {...reveal(0.08)} className={styles.address}><strong>VicentArt</strong><br />{address}</m.p>
    </section>
  )
}

function PreviewArtwork ({ id, lead = false, index = 0 }: { id: number, lead?: boolean, index?: number }) {
  const { reveal, hover } = useDesignMotion()
  const artwork = artworks.find(item => item.id === id)
  if (!artwork) return null

  return (
    <m.a {...reveal(index * 0.06)} {...hover} className={cn(styles.previewArtwork, lead && styles.leadArtwork)} href={routes.portfolio}>
      <span className={styles.previewImage}>
        <img className="h-auto w-full" src={artwork.src} alt={artwork.alt} width={artwork.width} height={artwork.height} loading="lazy" />
      </span>
      <span className={styles.previewCaption}>
        <span>Piece {String(id).padStart(2, '0')}</span>
        <span className={cn(styles.previewAction, !lead && '[@media(width<=640px)]:max-w-[3.2rem] [@media(width<=640px)]:truncate')}>Open in portfolio <span aria-hidden="true">→</span></span>
      </span>
    </m.a>
  )
}

function HomePage () {
  const featured = artworks[0]
  const { intro, image, reveal, hover } = useDesignMotion()

  return (
    <>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <m.p {...intro()} className={styles.locationTag}>Tattoo artist in Florida</m.p>
          <m.h1 {...intro(0.08)} id="home-title" className={styles.heroTitle}>VicentArt</m.h1>
          <m.p {...intro(0.16)} className={styles.artistRole}>Tattoo artist</m.p>
          <m.p {...intro(0.24)} className={styles.heroAddress}>{address}</m.p>
          <m.p {...intro(0.32)} className={designStyles.copy}>Explore black and grey and color tattoo work by Vicent in New Port Richey. Contact the artist to discuss your idea.</m.p>
          <m.div {...intro(0.4)} className={styles.actions}>
            <ContactLink />
            <Button asChild variant="outline"><m.a {...hover} href={routes.portfolio}>View portfolio</m.a></Button>
          </m.div>
          <m.dl {...intro(0.48)} className={styles.heroFacts}>
            <div><dt>Studio mode</dt><dd>By appointment</dd></div>
            <div><dt>Booking standard</dt><dd>I mostly work by appointment</dd></div>
          </m.dl>
        </div>
        <m.a {...image(0.16)} {...hover} className={styles.heroArtwork} href={routes.portfolio}>
          <img src={featured.src} alt={featured.alt} width={featured.width} height={featured.height} fetchPriority="high" />
          <span className={styles.featureCaption}>
            <span><strong>Selected work</strong><span>Original tattoo work</span></span>
            <span>Inspect on portfolio <span aria-hidden="true">→</span></span>
          </span>
        </m.a>
      </section>

      <section aria-labelledby="selected-title">
        <m.div {...reveal()} className={styles.sectionHeader}>
          <div>

            <h2 id="selected-title" className={designStyles.heading}>Selected work</h2>
            <p className={designStyles.copy}>Explore selected tattoo work by Vicent. Choose a piece to take a closer look.</p>
          </div>
          <a className={designStyles.textLink} href={routes.portfolio}>View all work <span aria-hidden="true">→</span></a>
        </m.div>
        <div className={styles.previewGrid}>
          <PreviewArtwork id={2} lead />
          <PreviewArtwork id={3} index={1} />
          <PreviewArtwork id={4} index={2} />
        </div>
      </section>

      <section className={styles.artistPreview} aria-labelledby="artist-title">
        <m.div {...reveal()} className={styles.portraitFrame}>
          <img src={artistImage} alt="Vicent concentrating on a tattoo in the studio" width="955" height="960" loading="lazy" />
        </m.div>
        <div className={styles.artistPreviewCopy}>
          <m.p {...reveal()} className={styles.eyebrow}>Meet the artist</m.p>
          <m.h2 {...reveal(0.06)} id="artist-title" className={designStyles.heading}>Meet Vicent</m.h2>
          <m.p {...reveal(0.12)} className={styles.artistMeta}>15+ years of tattoo experience · New Port Richey</m.p>
          <m.p {...reveal(0.18)} className={designStyles.copy}>{biography}</m.p>
          <m.div {...reveal(0.24)} className={styles.actions}>
            <Button asChild><m.a {...hover} href={routes.about}>About Vicent</m.a></Button>
            <span className={styles.linkDescription}>Full biography, philosophy & detailed process</span>
          </m.div>
        </div>
      </section>

      <section className={styles.bookingPreview} aria-labelledby="before-contact-title">
        <m.div {...reveal()} className={styles.centerHeading}>

          <h2 id="before-contact-title" className={designStyles.heading}>Before you get in touch</h2>
          <p className={designStyles.copy}>I mostly work by appointment. Here is a brief preview of what to prepare before starting a project.</p>
        </m.div>
        <div className={styles.checklistPanel}>
          <m.h3 {...reveal()}>Required details for your initial message</m.h3>
          <m.p {...reveal(0.06)} className={styles.smallCopy}>Please have these four items ready so we can give you an accurate response.</m.p>
          <ol className={styles.checklist}>
            {initialDetails.map(([title, description], index) => (
              <m.li {...reveal(index * 0.06)} key={title}><div><strong>{title}</strong><p>{description}</p></div></m.li>
            ))}
          </ol>
          <m.div {...reveal()} className={styles.checklistFoot}>
            <p>Deposits are non-refundable and required to confirm your date. Review the full policy before booking.</p>
            <a className={designStyles.textLink} href={`${routes.about}#booking`}>Read studio process <span aria-hidden="true">→</span></a>
            <a className={designStyles.textLink} href={routes.contact}>Go to contact <span aria-hidden="true">→</span></a>
          </m.div>
        </div>
      </section>
      <ContactEntry />
    </>
  )
}

function PortfolioPage () {
  const { intro, reveal, hover } = useDesignMotion()

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <m.p {...intro()} className={styles.locationTag}>Archive of authentic work</m.p>
          <m.h1 {...intro(0.08)} className={styles.pageTitle}>Portfolio</m.h1>
          <m.p {...intro(0.16)} className={designStyles.copy}>Select a piece to view it in full.</m.p>
        </div>
        <m.p {...intro(0.24)} className={styles.collectionCount}><strong>8 original pieces</strong> / View the collection</m.p>
      </header>
      <section aria-label="Tattoo portfolio">
        <ArtworkGallery layout="c" />
      </section>
      <div className={styles.portfolioClosing}>
        <ContactEntry compact />
        <aside className={styles.artistCard}>
          <m.div {...reveal()} className={styles.artistCardHeading}>
            <img src={artistImage} alt="Vicent working in the studio" width="955" height="960" loading="lazy" />
            <div><h2 className={designStyles.heading}>Vicent</h2><p className={styles.artistMeta}>Tattoo artist · New Port Richey<br />15+ years of tattoo experience</p></div>
          </m.div>
          <m.p {...reveal(0.08)} className={designStyles.copy}>{biography}</m.p>
          <m.div {...reveal(0.16)} className={styles.artistCardFoot}><span>{address}</span><m.a {...hover} className={designStyles.textLink} href={routes.about}>Read full story</m.a></m.div>
        </aside>
      </div>
    </>
  )
}

function AboutPage () {
  const { intro, reveal, hover } = useDesignMotion()

  return (
    <>
      <header className={styles.pageHeader}>
        <div>
          <m.h1 {...intro()} className={styles.pageTitle}>Meet the artist</m.h1>
          <m.p {...intro(0.08)} className={designStyles.copy}>Get to know Vicent, explore his creative philosophy, and understand the steps of commissioning custom studio work before reaching out.</m.p>
        </div>
        <m.nav {...intro(0.16)} className={styles.sectionNavigation} aria-label="About this page">
          <Button asChild variant="outline"><m.a {...hover} href="#biography">Biography</m.a></Button>
          <Button asChild variant="outline"><m.a {...hover} href="#philosophy">Philosophy</m.a></Button>
          <Button asChild variant="outline"><m.a {...hover} href="#booking">Process & booking</m.a></Button>
        </m.nav>
      </header>
      <section id="biography" className={styles.biography} aria-labelledby="biography-title">
        <div>
          <m.div {...reveal()} className={styles.portraitFrame}>
            <img src={artistImage} alt="Vicent creating a tattoo in the studio" width="955" height="960" loading="lazy" />
            <p className={styles.portraitCaption}>Vicent in the studio</p>
          </m.div>
          <dl className={styles.artistFacts}>
            <m.div {...reveal()}><dt>Experience</dt><dd>15+ years active</dd></m.div>
            <m.div {...reveal(0.06)}><dt>Specialization</dt><dd>Black & grey / color</dd></m.div>
            <m.div {...reveal(0.12)}><dt>Location</dt><dd>New Port Richey, FL</dd></m.div>
          </dl>
        </div>
        <div className={styles.biographyCopy}>
          <m.p {...reveal()} className={styles.eyebrow}>Meet the artist</m.p>
          <m.h2 {...reveal(0.06)} id="biography-title" className={designStyles.heading}>About Vicent</m.h2>
          <m.p {...reveal(0.12)} className={designStyles.copy}>{biography}</m.p>
          <m.div {...reveal(0.18)} className={styles.discussNote}><strong>Discuss your tattoo idea</strong><p>I mostly work by appointment. Contact me to discuss your tattoo idea.</p></m.div>
          <m.a {...reveal(0.24)} {...hover} className={designStyles.textLink} href="#booking">Review the studio process <span aria-hidden="true">→</span></m.a>
        </div>
      </section>
      <section id="philosophy" className={styles.philosophy} aria-labelledby="philosophy-title">
        <m.p {...reveal()} className={styles.eyebrow}>Studio principles & standards</m.p>
        <m.h2 {...reveal(0.06)} id="philosophy-title" className={designStyles.heading}>My philosophy</m.h2>
        <m.blockquote {...reveal(0.12)}>At Vicentart, we believe that a tattoo is more than just an image on the skin; it&apos;s a piece of your soul made visible.</m.blockquote>
        <m.p {...reveal(0.18)} className={designStyles.copy}>{philosophy}</m.p>
      </section>
      <div className={styles.bookingFull}><BookingSection id="booking" /></div>
      <ContactEntry />
    </>
  )
}

function ContactPage () {
  const { reveal, hover } = useDesignMotion()

  return (
    <>
      <div className={styles.contactPage}><ContactSection id="contact" headingLevel="h1" processHref={`${routes.about}#process`} /></div>
      <aside className={styles.contactArtist}>
        <m.img {...reveal()} src={artistImage} alt="Vicent working on a tattoo" width="955" height="960" loading="lazy" />
        <div>
          <m.p {...reveal()} className={styles.eyebrow}>Tattoo artist</m.p>
          <m.h2 {...reveal(0.06)} className={designStyles.heading}>Vicent</m.h2>
          <m.p {...reveal(0.12)} className={designStyles.copy}>{biography}</m.p>
          <m.a {...reveal(0.18)} {...hover} className={designStyles.textLink} href={routes.about}>View artist profile & philosophy <span aria-hidden="true">→</span></m.a>
        </div>
      </aside>
      <section className={styles.contactWork} aria-labelledby="recent-work-title">
        <m.div {...reveal()} className={styles.sectionHeader}><div><h2 id="recent-work-title" className={designStyles.heading}>Original pieces by Vicent</h2></div><m.a {...hover} className={designStyles.textLink} href={routes.portfolio}>View all 8 pieces <span aria-hidden="true">→</span></m.a></m.div>
        <div className={styles.contactPreviewGrid}>
          {[1, 2, 3, 4].map((id, index) => <PreviewArtwork key={id} id={id} index={index} />)}
        </div>
      </section>
    </>
  )
}

export default function MultiPageDesign ({ page }: { page: 'home' | 'portfolio' | 'about' | 'contact' }) {
  return (
    <main id="main-content" tabIndex={-1} className={cn(designStyles.container, styles.main)}>
      {page === 'home' ? <HomePage /> : page === 'portfolio' ? <PortfolioPage /> : page === 'about' ? <AboutPage /> : <ContactPage />}
    </main>
  )
}
