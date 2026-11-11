import type { TattooImage } from './ink-views'
import { gorillaFill, owlFill } from './ink-fill-paths'
import { gorillaSketch, owlSketch } from './ink-sketches'
import TattooDrawReveal from './TattooDrawReveal'

export default function InkDrawingExperience ({ image, drawing }: { image: TattooImage, drawing: 'gorilla' | 'owl' }) {
  return drawing === 'gorilla'
    ? <TattooDrawReveal image={image} paths={gorillaSketch} fill={gorillaFill} inDialog />
    : <TattooDrawReveal image={image} paths={owlSketch} fill={owlFill} inDialog />
}
