import artworks from './artworks'
import { tattooVideoStudies } from './tattoo-video-studies'
import type { TattooImage } from '../utils/ink-views'
import type { TattooVideoConfig } from '../utils/video-view'

export type PortfolioWork = TattooImage & {
  id: number
  title?: string
  drawingUrl: string
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
  artworks[0],
  recordings[0],
  recordings[1],
  artworks[6],
  ...artworks.slice(1, 6),
  artworks[7],
  recordings[2],
  recordings[3]
]
