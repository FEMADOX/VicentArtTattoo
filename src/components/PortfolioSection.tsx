import { PortfolioCarousel } from './PortfolioCarousel'

export const PortfolioSection = () => {
  return (
    <section id="portfolio" className="z-10 my-10">
      <div className="bg-black min-w-dvw p-5 pb-20">
        <h2 className="text-4xl mb-10 font-bold">Portfolio</h2>
        <PortfolioCarousel />
      </div>
    </section>
  )
}
