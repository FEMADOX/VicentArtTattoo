import InkDrawing from './InkDrawing'
import type { InkDrawingProps } from './InkDrawing'
import PreparedTattooDrawing from './PreparedTattooDrawing'
import type { TattooDrawingData } from '../utils/ink-drawing'

type PreparedTattooDrawingProps = Omit<InkDrawingProps, 'paths' | 'fill'> & {
  drawingUrl: string
  playOnMount?: boolean | undefined
}

type TattooDrawRevealProps = InkDrawingProps | PreparedTattooDrawingProps

const TattooDrawReveal = (props: TattooDrawRevealProps) => {
  if ('drawingUrl' in props) {
    const playOnMount = props.playOnMount ?? true
    return (
      <PreparedTattooDrawing
        {...props}
        renderDrawing={(drawing: TattooDrawingData) => (
          <InkDrawing
            key={JSON.stringify([props.image, drawing.paths, drawing.fill, props.sequence, playOnMount && props.initialComplete])}
            image={props.image}
            paths={drawing.paths}
            fill={drawing.fill}
            sequence={props.sequence}
            video={props.video}
            initialComplete={playOnMount && props.initialComplete}
            onAnimationStart={props.onAnimationStart}
            inDialog={props.inDialog}
          />
        )}
      />
    )
  }

  return <InkDrawing key={JSON.stringify([props.image, props.paths, props.fill, props.sequence, props.initialComplete])} {...props} />
}

export default TattooDrawReveal
