import * as m from 'motion/react-m'
import ArtworkGallery from '@/features/portfolio/ArtworkGallery'
import { portfolioWorks } from '@/features/portfolio/data/portfolio-works'
import { useSiteMotion } from '@/motion/useSiteMotion'
import siteStyles from '@/styles/site'

const styles = {
  portfolio: 'border-y border-border bg-surface',
  heading: 'mb-12 flex items-end justify-between gap-8 max-[700px]:mb-8 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-4',
  introduction: 'mt-4'
}

const PortfolioSection = () => {
  const { reveal } = useSiteMotion()

  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className={`${siteStyles.section} ${styles.portfolio}`}>
      <div className={siteStyles.container}>
        <div className={styles.heading}>
          <m.header {...reveal()}>
            <h2 className={siteStyles.heading} id="portfolio-heading">Portfolio</h2>
            <p className={`${siteStyles.copy} ${styles.introduction}`}>
              Explore four selected works. Open a photograph to view it in full, or explore recorded views where available.
            </p>
          </m.header>
        </div>
        <ArtworkGallery works={portfolioWorks} />
      </div>
    </section>
  )
}

export default PortfolioSection
