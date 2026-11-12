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
  { ...artworks[6], drawing: 'owl' },
  ...artworks.slice(1, 6),
  artworks[7],
  recordings[2],
  recordings[3]
]
