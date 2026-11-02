export interface TattooImage {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  width: number
  height: number
}

export interface TattooViewFrame {
  src: string
  srcSet?: string
  width: number
  height: number
}

export interface TattooViewSequence {
  referenceIndex: number
  frames: readonly TattooViewFrame[]
}

export function validateTattooSequence (
  image: TattooImage,
  sequence: TattooViewSequence
): string | null {
  if (sequence.frames.length < 2 || sequence.frames.length > 32) {
    return 'A view sequence must contain between 2 and 32 frames.'
  }
  if (!Number.isInteger(sequence.referenceIndex) ||
    !sequence.frames[sequence.referenceIndex]) {
    return 'The original view index is invalid.'
  }
  if (!image.src.trim() ||
    ![image.width, image.height].every(value => Number.isFinite(value) && value > 0)) {
    return 'The original photograph has invalid image details.'
  }
  for (const frame of sequence.frames) {
    const error = validateFrame(image, frame)
    if (error) return error
  }
  if (!matchesOriginal(image, sequence.frames[sequence.referenceIndex])) {
    return 'The original view must use the original photograph.'
  }
  return null
}

export function getViewIndex (x: number, width: number, count: number): number {
  if (!Number.isFinite(x) || !Number.isFinite(width) || width <= 0 ||
    !Number.isSafeInteger(count) || count < 1) return 0
  return Math.min(count - 1, Math.floor(Math.max(0, Math.min(x / width, 1)) * count))
}

function validateFrame (image: TattooImage, frame: TattooViewFrame): string | null {
  if (!frame.src.trim() || (frame.srcSet !== undefined && !frame.srcSet.trim())) {
    return 'Every view must have a non-empty image URL.'
  }
  if (frame.width !== image.width || frame.height !== image.height) {
    return 'Every view must match the original photograph dimensions.'
  }
  return null
}

function matchesOriginal (image: TattooImage, frame: TattooViewFrame) {
  return frame.src === image.src && frame.srcSet === image.srcSet
}
