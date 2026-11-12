import type { RefObject } from 'react'
import { useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import * as m from 'motion/react-m'
import { getStrokeProgress } from './ink-timeline'
import type { InkStrokeTiming } from './ink-timeline'
import type { InkFillPattern } from './ink-fill-paths'
import type { TattooImage } from './ink-views'

const styles = {
  original: 'relative z-2 block h-auto w-full group-data-[ink-state=complete]/ink:opacity-100!',
  paper: 'absolute inset-0 z-0 bg-[#f2f2f2]',
  sketch: 'pointer-events-none absolute inset-0 z-3 size-full',
  shading: 'grayscale',
  needle: 'opacity-0',
  inkDepth: 'group-data-[ink-state=complete]/ink:opacity-100!'
}

function DrawingStroke ({ d, clock, timing, pass, width }: { d: string, clock: MotionValue<number>, timing: InkStrokeTiming | undefined, pass: 'outline' | 'shading' | 'color', width: number }) {
  const pathLength = useTransform(clock, time => timing ? getStrokeProgress(time, timing) : 0)
  const opacity = useTransform(pathLength, value => value > 0 ? 1 : 0)
  return <m.path d={d} data-ink-stroke={pass} fill="none" stroke={pass === 'outline' ? '#171717' : '#fff'} strokeWidth={width} vectorEffect={pass === 'outline' ? 'non-scaling-stroke' : undefined} strokeLinecap="round" strokeLinejoin="round" style={{ pathLength, opacity }} />
}

type InkDrawingSurfaceProps = {
  image: TattooImage
  displayed: Pick<TattooImage, 'src' | 'srcSet'>
  fill: InkFillPattern
  paths: readonly string[]
  timings: InkStrokeTiming[]
  clock: MotionValue<number>
  photoOpacity: MotionValue<number>
  surfaceOpacity: MotionValue<number>
  contoursOpacity: MotionValue<number>
  showSketch: boolean
  svgVisibility: 'visible' | 'hidden'
  overlayVisibility: 'visible' | 'hidden'
  exploring: boolean
  enhanceBlacks: boolean
  depthVisibility: 'visible' | 'hidden'
  regionId: string
  shadingMaskId: string
  colorMaskId: string
  inkDepthId: string
  imageRef: RefObject<HTMLImageElement | null>
  svgRef: RefObject<SVGSVGElement | null>
  needleRef: RefObject<SVGGElement | null>
}

export default function InkDrawingSurface ({ image, displayed, fill, paths, timings, clock, photoOpacity, surfaceOpacity, contoursOpacity, showSketch, svgVisibility, overlayVisibility, exploring, enhanceBlacks, depthVisibility, regionId, shadingMaskId, colorMaskId, inkDepthId, imageRef, svgRef, needleRef }: InkDrawingSurfaceProps) {
  return (
    <>
      <span className={styles.paper} hidden={!showSketch} />
      <m.img ref={imageRef} className={styles.original} src={displayed.src} srcSet={displayed.srcSet} sizes={image.sizes} alt={image.alt} width={image.width} height={image.height} decoding="async" draggable={false} style={{ opacity: photoOpacity }} />
      <m.svg ref={svgRef} className={styles.sketch} viewBox={'0 0 ' + image.width + ' ' + image.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" style={{ visibility: exploring ? 'hidden' : svgVisibility }}>
        <defs>
          <clipPath id={regionId} clipPathUnits="userSpaceOnUse"><path d={fill.region} data-ink-region="" /></clipPath>
          {enhanceBlacks && (
            <filter id={inkDepthId} filterUnits="userSpaceOnUse" x={0} y={0} width={image.width} height={image.height} colorInterpolationFilters="sRGB">
              {/* Favor dark neutral tones over skin and colored highlights. */}
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.4252 5.0696 -3.6444 0 1" />
              <feComponentTransfer><feFuncA type="linear" slope={0.34} /></feComponentTransfer>
              <feComposite in2="SourceAlpha" operator="in" />
            </filter>
          )}
          <mask id={shadingMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0} width={image.width} height={image.height}>
            <g clipPath={'url(#' + regionId + ')'}>
              {fill.paths.map((d, index) => <DrawingStroke key={d} d={d} clock={clock} timing={timings[paths.length + index]} pass="shading" width={fill.strokeWidth} />)}
            </g>
          </mask>
          <mask id={colorMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0} width={image.width} height={image.height}>
            <g clipPath={'url(#' + regionId + ')'}>
              {fill.paths.map((d, index) => <DrawingStroke key={d} d={d} clock={clock} timing={timings[paths.length + fill.paths.length + index]} pass="color" width={fill.strokeWidth} />)}
            </g>
          </mask>
        </defs>
        <m.g data-ink-animation="" style={{ opacity: surfaceOpacity, visibility: overlayVisibility }}>
          <image data-ink-layer="shading" href={image.src} width={image.width} height={image.height} mask={'url(#' + shadingMaskId + ')'} className={styles.shading} />
          {enhanceBlacks && <image data-ink-depth-pass="shading" href={image.src} width={image.width} height={image.height} mask={'url(#' + shadingMaskId + ')'} filter={'url(#' + inkDepthId + ')'} visibility={depthVisibility} />}
          <image data-ink-layer="color" href={image.src} width={image.width} height={image.height} mask={'url(#' + colorMaskId + ')'} />
          {enhanceBlacks && <image data-ink-depth-pass="color" href={image.src} width={image.width} height={image.height} mask={'url(#' + colorMaskId + ')'} filter={'url(#' + inkDepthId + ')'} visibility={depthVisibility} />}
          <m.g style={{ opacity: contoursOpacity }}>
            {paths.map((d, index) => <DrawingStroke key={d} d={d} clock={clock} timing={timings[index]} pass="outline" width={2} />)}
          </m.g>
          <g ref={needleRef} data-ink-needle="" data-ink-machine="" className={styles.needle} stroke="#20242a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M -126 1 V -65 Q -126 -70 -121 -70 H -62 V -58 H -110 V -14 H -80 V 1 Z" fill="#30363d" />
            <rect x={-116} y={-19} width={57} height={7} rx={2} fill="#b7bec5" />
            <rect x={-112} y={-50} width={19} height={32} rx={4} fill="#bd7b46" />
            <rect x={-85} y={-50} width={19} height={32} rx={4} fill="#bd7b46" />
            <path d="M -110 -43 H -95 M -110 -36 H -95 M -110 -29 H -95 M -83 -43 H -68 M -83 -36 H -68 M -83 -29 H -68" fill="none" stroke="#e3b580" strokeWidth={3} />
            <path d="M -120 -59 H -65 L -51 -49 L -55 -44 L -72 -52 H -120 Z" fill="#c4cbd1" />
            <path d="M -75 -70 V -81 H -63 V -59" fill="none" stroke="#515b65" strokeWidth={6} />
            <path d="M -68 -82 H -58" fill="none" stroke="#c4cbd1" strokeWidth={5} />
            <circle cx={-119} cy={-63} r={3} fill="#dbe0e4" />
            <circle cx={-119} cy={-7} r={3} fill="#dbe0e4" />
            <path d="M -79 -13 L -66 -5" fill="none" stroke="#9aa4ad" strokeWidth={7} />
            <rect x={-79} y={-12} width={44} height={24} rx={8} fill="#30363d" />
            <path d="M -70 -9 V 9 M -62 -10 V 10 M -54 -10 V 10 M -46 -10 V 10" fill="none" stroke="#7c8792" strokeWidth={3} />
            <path d="M -35 -8 H -22 L -10 -3 V 3 L -22 8 H -35 Z" fill="#bcc5cd" />
            <path d="M -10 0 H 0" fill="none" stroke="#171717" strokeWidth={2.5} />
          </g>
        </m.g>
        {enhanceBlacks && (
          <m.g data-ink-depth="" className={styles.inkDepth} style={{ opacity: photoOpacity, visibility: depthVisibility }}>
            <image href={image.src} width={image.width} height={image.height} clipPath={'url(#' + regionId + ')'} filter={'url(#' + inkDepthId + ')'} />
          </m.g>
        )}
      </m.svg>
    </>
  )
}
