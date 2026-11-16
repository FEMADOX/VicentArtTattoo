import { artworks } from './content'
import { tattooVideoStudies } from './tattoo-video-studies'
import type { TattooImage } from './ink-views'
import type { TattooVideoConfig } from './video-view'

export type PortfolioWork = TattooImage & {
  id: number
  title?: string
  drawing?: 'gorilla' | 'owl'
  drawingUrl?: string
  video?: TattooVideoConfig
}

const recordings = tattooVideoStudies.map((study, index): PortfolioWork => ({
  ...study.image,
  id: 9 + index,
  title: study.label,
  drawingUrl: study.drawingUrl,
  video: study.video
}))

export const portfolioWorks: readonly PortfolioWork[] = [
  { ...artworks[0], drawing: 'gorilla' },
  recordings[0],
  recordings[1],
  { ...artworks[1], drawingUrl: '/drawings/tattoos/portfolio2-drawing.json' },
  { ...artworks[2], drawingUrl: '/drawings/tattoos/portfolio3-drawing.json' },
  { ...artworks[3], drawingUrl: '/drawings/tattoos/portfolio4-drawing.json' },
  { ...artworks[4], drawingUrl: '/drawings/tattoos/portfolio5-drawing.json' },
  { ...artworks[5], drawingUrl: '/drawings/tattoos/portfolio6-drawing.json' },
  { ...artworks[6], drawing: 'owl' },
  { ...artworks[7], drawingUrl: '/drawings/tattoos/portfolio8-drawing.json' },
  recordings[2],
  recordings[3]
]
