import { PortfolioCarousel } from './PortfolioCarousel'

export const PortfolioSection = () => (
  <section id="portfolio" className="my-10">
    <div className="bg-black min-w-dvw px-5 py-10">
      <h2 className="text-4xl mb-10 font-bold font-cinzel">Portfolio</h2>
      <PortfolioCarousel />
    </div>
  </section>
)
