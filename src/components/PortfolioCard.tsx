import { CarouselItem } from '@/components/ui/carousel.tsx'

interface PortfolioProps {
  index: number
  image: string
  alt: string
}

export const PortfolioCard = ({ index, image, alt }: PortfolioProps) => (
  <CarouselItem className="basis-1/2 sm:basis-1/4 ">
    <img
      className="w-80 h-80 max-h-80 object-cover rounded-2xl hover:opacity-70 transition-opacity duration-200"
      key={index}
      src={image}
      alt={alt}
    />
  </CarouselItem>
)
