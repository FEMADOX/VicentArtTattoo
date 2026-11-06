import { Pause, Play } from 'lucide-react'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from './ui/carousel'
import { Button } from './ui/button'
import { portfolioImages } from '@/assets/images'
import { PortfolioCard } from './PortfolioCard'
import { useCarousel } from '@/hooks/useCarousel'

export const PortfolioCarousel = () => {
  const { count, current, setApi, autoplay, isPlaying, reducedMotion, stop, toggle } = useCarousel()

  return (
    <Carousel
      setApi={setApi}
      plugins={[autoplay]}
      opts={{ loop: true, align: 'start' }}
      onFocusCapture={stop}
      onMouseEnter={stop}
      aria-label="Tattoo portfolio"
    >
      <CarouselContent className="items-start">
        {portfolioImages.map(({ image, alt }, index) => (
          <PortfolioCard key={image} index={index} image={image} alt={alt} />
        ))}
      </CarouselContent>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          Slide {current} of {count}
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={toggle} disabled={reducedMotion} aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}>
            {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <CarouselPrevious className="static size-11 translate-y-0" />
          <CarouselNext className="static size-11 translate-y-0" />
        </div>
      </div>
      {reducedMotion && (
        <p className="mt-3 text-sm text-muted-foreground">Autoplay is off while reduced motion is enabled.</p>
      )}
    </Carousel>
  )
}
