import { CarouselItem } from '@/components/ui/carousel'

interface PortfolioProps {
  index: number
  image: string
  alt: string
}

export const PortfolioCard = ({ index, image, alt }: PortfolioProps) => (
  <CarouselItem className="basis-4/5 sm:basis-1/2 lg:basis-1/3" aria-label={`Tattoo ${index + 1}`}>
    <img
      className="h-auto w-full"
      src={image}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  </CarouselItem>
)
