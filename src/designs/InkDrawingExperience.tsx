import type { TattooImage } from './ink-views'
import { gorillaFill, owlFill } from './ink-fill-paths'
import { gorillaSketch, owlSketch } from './ink-sketches'
import TattooDrawReveal from './TattooDrawReveal'
import type { TattooVideoConfig } from './video-view'

type InkDrawingExperienceProps = {
  image: TattooImage
  drawing: 'gorilla' | 'owl'
  video?: TattooVideoConfig | undefined
  drawingUrl?: string | undefined
  onOpenOriginal?: ((image: TattooImage, opener: HTMLButtonElement) => void) | undefined
}

export default function InkDrawingExperience ({ image, drawing, video, drawingUrl, onOpenOriginal }: InkDrawingExperienceProps) {
  if (drawingUrl) return <TattooDrawReveal image={image} video={video} drawingUrl={drawingUrl} onOpenOriginal={onOpenOriginal} />
  return drawing === 'gorilla'
    ? <TattooDrawReveal image={image} paths={gorillaSketch} fill={gorillaFill} onOpenOriginal={onOpenOriginal} />
    : <TattooDrawReveal image={image} paths={owlSketch} fill={owlFill} onOpenOriginal={onOpenOriginal} />
}
