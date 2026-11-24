import * as m from 'motion/react-m'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useSiteMotion } from '@/motion/useSiteMotion'
import siteStyles from '@/styles/site'
import { artistImage, biography, philosophy } from '@/content/site'

const styles = {
  aboutInner: 'grid grid-cols-[0.8fr_1fr] items-center gap-16 max-[900px]:gap-8 max-[700px]:grid-cols-1',
  artistPortrait: 'm-0 min-w-0 max-w-120 [&_img]:h-auto [&_img]:w-full [&_img]:grayscale [&_figcaption]:mt-4 [&_figcaption]:flex [&_figcaption]:justify-between [&_figcaption]:gap-4 [&_figcaption]:font-mono [&_figcaption]:text-xs [&_figcaption]:text-muted-foreground max-[700px]:max-w-none',
  aboutHeading: 'mb-8',
  philosophy: 'mt-8 border border-border bg-surface px-6'
}

const AboutSection = () => {
  const { reveal } = useSiteMotion()

  return (
    <section id="about" aria-labelledby="about-heading" className={siteStyles.section}>
      <div className={`${siteStyles.container} ${styles.aboutInner}`}>
        <m.figure {...reveal()} className={styles.artistPortrait}>
          <img src={artistImage} alt="Vicent concentrating on a tattoo at work" width={955} height={960} loading="lazy" decoding="async" />
          <figcaption><span>Vicent</span><span>The artist at work</span></figcaption>
        </m.figure>
        <div>
          <m.header {...reveal()} className={styles.aboutHeading}>
            <h2 className={siteStyles.heading} id="about-heading">About Vicent</h2>
            <p className={`${siteStyles.profession} text-sm/[inherit] [@media(width<=700px)]:text-sm/[inherit]`}>Tattoo artist · New Port Richey</p>
          </m.header>
          <m.div {...reveal(0.08)}><p className={siteStyles.copy}>{biography}</p></m.div>
          <Accordion type="multiple" className={styles.philosophy}><AccordionItem value="philosophy"><AccordionTrigger>My philosophy</AccordionTrigger><AccordionContent><p className={siteStyles.copy}>{philosophy}</p></AccordionContent></AccordionItem></Accordion>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
