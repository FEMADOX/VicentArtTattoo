import { CarouselItem } from '@/components/ui/carousel'

type PortfolioProps = {
  index: number
  image: string
  alt: string
}

export const PortfolioCard = ({ index, image, alt }: PortfolioProps) => (
  <CarouselItem className="basis-4/5 sm:basis-1/2 lg:basis-1/3" aria-label={`Tattoo ${index + 1}`}>
    <img
      className="aspect-3/4 w-full bg-background object-contain"
      src={image}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  </CarouselItem>
)
