import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useState } from 'react'
import { Carousel, type CarouselApi, CarouselContent } from './ui/carousel'
import { portfolioImages } from '@/assets/images'
import { PortfolioCard } from './PortfolioCard'

const pluginAutoplay = Autoplay({ delay: 2000 })

export const PortfolioCarousel = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(portfolioImages.length)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <>
      <Carousel setApi={setApi} plugins={[pluginAutoplay]}>
        <CarouselContent>
          {portfolioImages.map(({ image, alt }, index) => (
            <PortfolioCard key={index} index={index} image={image} alt={alt} />
          ))}
        </CarouselContent>
      </Carousel>
      <p className="text-muted-foreground text-center text-lg mt-4">
        Slide {current} of {count}
      </p>
    </>
  )
}
