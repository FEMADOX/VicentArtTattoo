import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent } from './ui/carousel'
import { portfolioImages } from '@/assets/images'
import { PortfolioCard } from './PortfolioCard'
import { useCarousel } from '@/hooks'

const pluginAutoplay = Autoplay({ delay: 2000 })

export const PortfolioCarousel = () => {
  const { count, current, setApi } = useCarousel()

  return (
    <>
      <Carousel setApi={setApi} plugins={[pluginAutoplay]}>
        <CarouselContent>
          {portfolioImages.map(({ image, alt }, index) => (
            <PortfolioCard key={index} index={index} image={image} alt={alt} />
          ))}
        </CarouselContent>
      </Carousel>
      <p className="text-muted-foreground text-center text-lg mt-4 font-roboto">
        Slide {current} of {count}
      </p>
    </>
  )
}
