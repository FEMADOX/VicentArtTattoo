import * as m from 'motion/react-m'
import { ArtworkGallery, BookingSection, ContactSection } from './components'
import { artworks, artistImage, biography, philosophy, address } from './content'
import { useDesignMotion } from './motion'
import { cn } from '../lib/utils'
import { designStyles } from './styles'
import { Button } from '../components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import type { PortfolioWork } from './portfolio-works'

const styles = {
  page: 'bg-background text-foreground',
  hero: 'py-16 max-[700px]:py-8',
  heroB: 'py-16 max-[700px]:py-8',
  heroInner: 'grid grid-cols-2 items-center gap-16 max-[900px]:gap-8 max-[700px]:grid-cols-1',
  heroInnerB: 'grid-cols-[0.85fr_1.15fr] max-[700px]:grid-cols-1',
  appointment: 'mb-4 font-mono text-xs text-muted-foreground [&_span]:hidden',
  title: 'm-0 font-display text-[clamp(3rem,6vw,5rem)] leading-none font-normal tracking-wide uppercase max-[700px]:text-[clamp(2.5rem,12vw,4rem)]',
  titleB: 'text-[clamp(3rem,5vw,4.5rem)]',
  profession: 'mt-3 font-display text-2xl text-body',
  location: 'mt-6 text-lg text-body',
  streetAddress: 'mt-2 text-base text-muted-foreground',
  introduction: 'my-8',
  actions: 'flex flex-wrap items-stretch gap-4 max-[700px]:flex-col',
  quickFacts: 'mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 [&_dt]:mb-2 [&_dt]:font-mono [&_dt]:text-xs [&_dt]:text-muted-foreground [&_dd]:m-0 [&_dd]:text-base',
  featuredWork: 'col-start-1 row-start-1 m-0 min-w-0 [&_img]:h-auto [&_img]:w-full [&_figcaption]:mt-4 [&_figcaption]:flex [&_figcaption]:flex-wrap [&_figcaption]:justify-between [&_figcaption]:gap-3 [&_figcaption]:font-mono [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground max-[700px]:col-auto max-[700px]:row-auto',
  portfolio: 'border-y border-border bg-surface',
  eyebrow: 'mb-3 font-mono text-xs text-muted-foreground',
  portfolioHeading: 'mb-12 flex items-end justify-between gap-8 max-[700px]:mb-8 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-4',
  portfolioIntro: 'mt-4',
  workCount: 'shrink-0 font-mono text-xs text-muted-foreground',
  aboutInner: 'grid grid-cols-[0.8fr_1fr] items-center gap-16 max-[900px]:gap-8 max-[700px]:grid-cols-1',
  artistPortrait: 'm-0 min-w-0 max-w-120 [&_img]:h-auto [&_img]:w-full [&_img]:grayscale [&_figcaption]:mt-4 [&_figcaption]:flex [&_figcaption]:justify-between [&_figcaption]:gap-4 [&_figcaption]:font-mono [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground max-[700px]:max-w-none',
  aboutHeading: 'mb-8',
  aboutHeadingB: 'mb-8',
  biographyB: 'border border-border bg-surface p-8 max-[700px]:p-6',
  philosophy: 'mt-8 border border-border bg-surface px-6',
  pairedImages: 'grid grid-cols-2 items-start gap-4 [&_img]:h-auto [&_img]:w-full [&_figcaption]:pt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_figcaption>p:last-child]:text-base [&_figcaption>p:last-child]:text-body',
  practiceCard: 'm-0 min-w-0 [&_img]:grayscale',
  tattooCard: 'm-0 min-w-0',
  cardLabel: 'mb-3 font-mono text-xs text-muted-foreground',
  pairCaption: 'mt-4 font-mono text-xs text-muted-foreground',
  backgroundHeading: 'mb-6 font-display text-2xl',
  artistFacts: 'mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6 [&_dt]:mb-2 [&_dt]:font-mono [&_dt]:text-xs [&_dt]:text-muted-foreground [&_dd]:m-0 [&_dd]:text-base max-[700px]:grid-cols-2'
}

function Identity ({ design }: { design: 'a' | 'b' }) {
  const { intro, hover } = useDesignMotion()

  return (
    <div className={cn('min-w-0', design === 'a' && 'col-start-2 [@media(width<=700px)]:col-auto')}>
      <m.p {...intro()} className={styles.appointment}><span aria-hidden="true" />By appointment</m.p>
      <m.h1 {...intro(0.08)} className={cn(styles.title, design === 'b' && styles.titleB)}>VicentArt</m.h1>
      <m.p {...intro(0.16)} className={styles.profession}>Tattoo artist</m.p>
      <m.p {...intro(0.24)} className={styles.location}>New Port Richey, Florida</m.p>
      {design === 'b' ? <p className={styles.streetAddress}>{address}</p> : null}
      <m.p {...intro(0.32)} className={cn(designStyles.copy, styles.introduction)}>
        Explore original black and grey and color tattoo work by Vicent in
        New Port Richey. Contact the artist to discuss your idea.
      </m.p>
      <m.div {...intro(0.4)} className={cn(styles.actions, design === 'a' && '[@media(width<=700px)]:grid-cols-1')}>
        <Button asChild><m.a {...hover} href="#contact">Contact the artist</m.a></Button>
        <Button asChild variant="outline">
          <m.a {...hover} href={design === 'a' ? '#portfolio' : '#about'}>
            {design === 'a' ? 'Explore the portfolio' : 'Meet Vicent'}
          </m.a>
        </Button>
      </m.div>
      <m.dl {...intro(0.48)} className={styles.quickFacts}>
        <div>
          <dt>Booking standard</dt>
          <dd>I mostly work by appointment</dd>
        </div>
        <div>
          <dt>Medium</dt>
          <dd>Black &amp; grey and vibrant color</dd>
        </div>
      </m.dl>
    </div>
  )
}

function ArtistBiography ({ design }: { design: 'a' | 'b' }) {
  const { reveal } = useDesignMotion()

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className={cn(designStyles.section, design === 'b' && 'border-t border-border')}
    >
      <div className={cn(designStyles.container, styles.aboutInner, design === 'b' && 'block [@media(width<=700px)]:block')}>
        {design === 'a'
          ? (
              <m.figure {...reveal()} className={styles.artistPortrait}>
                <img
                  src={artistImage}
                  alt="Vicent concentrating on a tattoo at work"
                  width={955}
                  height={960}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption><span>Vicent</span><span>The artist at work</span></figcaption>
              </m.figure>
            )
          : null}
        <div className={design === 'b' ? 'mx-auto max-w-220' : undefined}>
          <m.header {...reveal()} className={cn(styles.aboutHeading, design === 'b' && styles.aboutHeadingB)}>

            <h2 className={designStyles.heading} id="about-heading">About Vicent</h2>
            {design === 'a' ? <p className={cn(styles.profession, 'text-sm/[inherit] [@media(width<=700px)]:text-sm/[inherit]')}>Tattoo artist Â· New Port Richey</p> : null}
          </m.header>
          <m.div {...reveal(0.08)} className={design === 'b' ? styles.biographyB : undefined}>
            {design === 'b' ? <h3 className={styles.backgroundHeading}>Artist background</h3> : null}
            <p className={designStyles.copy}>{biography}</p>
            {design === 'b'
              ? (
                  <dl className={styles.artistFacts}>
                    <div><dt>Experience</dt><dd>15+ years of tattoo experience</dd></div>
                    <div><dt>Work</dt><dd>Black &amp; grey / Color</dd></div>
                    <div><dt>Studio mode</dt><dd>By appointment</dd></div>
                  </dl>
                )
              : null}
          </m.div>
          <Accordion type="multiple" className={styles.philosophy}><AccordionItem value="philosophy"><AccordionTrigger>My philosophy</AccordionTrigger><AccordionContent><p className={designStyles.copy}>{philosophy}</p></AccordionContent></AccordionItem></Accordion>
        </div>
      </div>
    </section>
  )
}

function HeroArtwork ({ design, featured }: { design: 'a' | 'b', featured: typeof artworks[number] }) {
  const { image } = useDesignMotion()

  if (design === 'a') {
    return (
      <m.figure {...image(0.16)} className={styles.featuredWork}>
        <img src={featured.src} alt={featured.alt} width={featured.width} height={featured.height} fetchPriority="high" decoding="async" />
        <figcaption><span>Original tattoo work</span><span>New Port Richey, FL</span></figcaption>
      </m.figure>
    )
  }

  return (
    <div className="min-w-0">
      <div className={styles.pairedImages}>
        <figure className={styles.practiceCard}>
          <img src={artistImage} alt="Vicent concentrating on a tattoo at work" width={955} height={960} fetchPriority="high" decoding="async" />
          <figcaption><p className={styles.cardLabel}>The artist at work</p><h2>Vicent in practice</h2><p>Over 15 years of tattoo experience.</p></figcaption>
        </figure>
        <figure className={styles.tattooCard}>
          <img src={featured.src} alt={featured.alt} width={featured.width} height={featured.height} fetchPriority="high" decoding="async" />
          <figcaption><p className={styles.cardLabel}>Finished tattoo</p><h2>Tattoo work</h2><p>Original tattoo work by Vicent.</p></figcaption>
        </figure>
      </div>
      <p className={styles.pairCaption}>The artist and the work</p>
    </div>
  )
}

function Hero ({ design }: { design: 'a' | 'b' }) {
  const featured = artworks[0]

  return (
    <section id="home" aria-label="VicentArt tattoo artist" className={cn(styles.hero, design === 'b' && styles.heroB)}>
      <div className={cn(designStyles.container, styles.heroInner, design === 'b' && styles.heroInnerB)}>
        <Identity design={design} />
        <HeroArtwork design={design} featured={featured} />
      </div>
    </section>
  )
}

function DesignPortfolio ({ design, works }: { design: 'a' | 'b', works?: readonly PortfolioWork[] | undefined }) {
  const { reveal } = useDesignMotion()
  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className={cn(designStyles.section, styles.portfolio, design === 'b' && 'bg-background')}>
      <div className={designStyles.container}>
        <div className={styles.portfolioHeading}>
          <m.header {...reveal()}>
            <h2 className={designStyles.heading} id="portfolio-heading">{design === 'a' ? 'Portfolio' : 'Selected work'}</h2>
            <p className={cn(designStyles.copy, styles.portfolioIntro)}>
              {design === 'a'
                ? 'Explore four selected works. Open a photograph to view it in full, or explore recorded views where available.'
                : 'Explore eight original works. Select any photograph to view the full, uncropped image at its original size.'}
            </p>
          </m.header>
          {design === 'b' ? <p className={styles.workCount}>08 original pieces</p> : null}
        </div>
        <ArtworkGallery layout={design} preview={design === 'a'} works={works} />
      </div>
    </section>
  )
}

export default function SinglePageDesign ({ design, works }: { design: 'a' | 'b', works?: readonly PortfolioWork[] | undefined }) {
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <Hero design={design} />
      {design === 'b' ? <ArtistBiography design={design} /> : null}
      <DesignPortfolio design={design} works={works} />
      {design === 'a' ? <ArtistBiography design={design} /> : null}
      <BookingSection id="process" />
      <ContactSection id="contact" />
    </main>
  )
}
