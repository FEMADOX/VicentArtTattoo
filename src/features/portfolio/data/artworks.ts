import { portfolioImages } from '@/assets/images'

const [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5, portfolio6, portfolio7, portfolio8] = portfolioImages

const artworks = [
  { id: 1, src: portfolio1.image, alt: portfolio1.alt, width: 1125, height: 2000, drawingUrl: '/drawings/tattoos/portfolio1-drawing.json' },
  { id: 2, src: portfolio2.image, alt: portfolio2.alt, width: 1054, height: 2046, drawingUrl: '/drawings/tattoos/portfolio2-drawing.json' },
  { id: 3, src: portfolio3.image, alt: portfolio3.alt, width: 1125, height: 1401, drawingUrl: '/drawings/tattoos/portfolio3-drawing.json' },
  { id: 4, src: portfolio4.image, alt: portfolio4.alt, width: 1536, height: 2048, drawingUrl: '/drawings/tattoos/portfolio4-drawing.json' },
  { id: 5, src: portfolio5.image, alt: portfolio5.alt, width: 833, height: 1600, drawingUrl: '/drawings/tattoos/portfolio5-drawing.json' },
  { id: 6, src: portfolio6.image, alt: portfolio6.alt, width: 953, height: 1600, drawingUrl: '/drawings/tattoos/portfolio6-drawing.json' },
  { id: 7, src: portfolio7.image, alt: portfolio7.alt, width: 1078, height: 1379, drawingUrl: '/drawings/tattoos/portfolio7-drawing.json' },
  { id: 8, src: portfolio8.image, alt: portfolio8.alt, width: 821, height: 1600, drawingUrl: '/drawings/tattoos/portfolio8-drawing.json' }
] as const

export default artworks
