import { PortfolioCarousel } from './PortfolioCarousel'

export const PortfolioSection = () => (
  <section id="portfolio" aria-labelledby="portfolio-heading" className="scroll-mt-24 border-y border-border px-5 py-20 md:px-10 md:py-28">
    <div className="mx-auto max-w-7xl">
      <h2 id="portfolio-heading" className="mb-10 font-display text-4xl uppercase tracking-wide md:text-5xl">Portfolio</h2>
      <PortfolioCarousel />
    </div>
  </section>
)
