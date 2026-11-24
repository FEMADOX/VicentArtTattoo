import * as m from 'motion/react-m'
import { Button } from '@/components/ui/button'
import { useSiteMotion } from '@/motion/useSiteMotion'
import siteStyles from '@/styles/site'
import artworks from '@/features/portfolio/data/artworks'

const styles = {
  hero: 'py-16 max-[700px]:py-8',
  heroInner: 'grid grid-cols-2 items-center gap-16 max-[900px]:gap-8 max-[700px]:grid-cols-1',
  appointment: 'mb-4 font-mono text-xs text-muted-foreground [&_span]:hidden',
  title: 'm-0 font-display text-[clamp(3rem,6vw,5rem)] leading-none font-normal tracking-wide uppercase max-[700px]:text-[clamp(2.5rem,12vw,4rem)]',
  location: 'mt-6 text-lg text-body',
  introduction: 'my-8',
  actions: 'flex flex-wrap items-stretch gap-4 max-[700px]:flex-col',
  quickFacts: 'mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 [&_dt]:mb-2 [&_dt]:font-mono [&_dt]:text-xs [&_dt]:text-muted-foreground [&_dd]:m-0 [&_dd]:text-base',
  featuredWork: 'col-start-1 row-start-1 m-0 min-w-0 [&_img]:h-auto [&_img]:w-full [&_figcaption]:mt-4 [&_figcaption]:flex [&_figcaption]:flex-wrap [&_figcaption]:justify-between [&_figcaption]:gap-3 [&_figcaption]:font-mono [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground max-[700px]:col-auto max-[700px]:row-auto'
}

const Identity = () => {
  const { intro, hover } = useSiteMotion()

  return (
    <div className="col-start-2 min-w-0 [@media(width<=700px)]:col-auto">
      <m.p {...intro()} className={styles.appointment}><span aria-hidden="true" />By appointment</m.p>
      <m.h1 {...intro(0.08)} className={styles.title}>VicentArt</m.h1>
      <m.p {...intro(0.16)} className={siteStyles.profession}>Tattoo artist</m.p>
      <m.p {...intro(0.24)} className={styles.location}>New Port Richey, Florida</m.p>
      <m.p {...intro(0.32)} className={`${siteStyles.copy} ${styles.introduction}`}>
        Explore original black and grey and color tattoo work by Vicent in
        New Port Richey. Contact the artist to discuss your idea.
      </m.p>
      <m.div {...intro(0.4)} className={`${styles.actions} [@media(width<=700px)]:grid-cols-1`}>
        <Button asChild><m.a {...hover} href="#contact">Contact the artist</m.a></Button>
        <Button asChild variant="outline"><m.a {...hover} href="#portfolio">Explore the portfolio</m.a></Button>
      </m.div>
      <m.dl {...intro(0.48)} className={styles.quickFacts}>
        <div><dt>Booking standard</dt><dd>I mostly work by appointment</dd></div>
        <div><dt>Medium</dt><dd>Black &amp; grey and vibrant color</dd></div>
      </m.dl>
    </div>
  )
}

const HeroArtwork = () => {
  const featured = artworks[0]
  const { image } = useSiteMotion()

  return (
    <m.figure {...image(0.16)} className={styles.featuredWork}>
      <img src={featured.src} alt={featured.alt} width={featured.width} height={featured.height} fetchPriority="high" decoding="async" />
      <figcaption><span>Original tattoo work</span><span>New Port Richey, FL</span></figcaption>
    </m.figure>
  )
}

const HeroSection = () => (
  <section id="home" aria-label="VicentArt tattoo artist" className={styles.hero}>
    <div className={`${siteStyles.container} ${styles.heroInner}`}>
      <Identity />
      <HeroArtwork />
    </div>
  </section>
)

export default HeroSection
