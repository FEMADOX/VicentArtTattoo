import { useEffect, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import type { CarouselApi } from '@/components/ui/carousel'

export const useCarousel = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(1)
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [autoplay] = useState(() => Autoplay({
    delay: 2000,
    playOnInit: false,
    stopOnInteraction: true,
    stopOnFocusIn: true,
    stopOnMouseEnter: true
  }))

  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
      setCount(api.scrollSnapList().length)
    }
    const handlePlay = () => setIsPlaying(true)
    const handleStop = () => setIsPlaying(false)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      setReducedMotion(media.matches)
      if (media.matches) autoplay.stop()
    }

    handleSelect()
    handleMotionChange()
    api.on('select', handleSelect)
    api.on('reInit', handleSelect)
    api.on('autoplay:play', handlePlay)
    api.on('autoplay:stop', handleStop)
    media.addEventListener('change', handleMotionChange)
    if (!media.matches) autoplay.play()

    return () => {
      autoplay.stop()
      api.off('select', handleSelect)
      api.off('reInit', handleSelect)
      api.off('autoplay:play', handlePlay)
      api.off('autoplay:stop', handleStop)
      media.removeEventListener('change', handleMotionChange)
    }
  }, [api, autoplay])

  const stop = () => autoplay.stop()
  const toggle = () => {
    if (autoplay.isPlaying()) autoplay.stop()
    else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) autoplay.play()
  }

  return { api, setApi, current, count, autoplay, isPlaying, reducedMotion, stop, toggle }
}
