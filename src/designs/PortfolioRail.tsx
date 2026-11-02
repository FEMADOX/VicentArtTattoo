import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel'
import type { CarouselApi } from '../components/ui/carousel'
import { cn } from '../lib/utils'
import { useDesignMotion } from './motion'
import MasonryGrid from './MasonryGrid'

const desktopQuery = '(min-width: 1024px) and (min-height: 700px) and (pointer: fine)'

function subscribeDesktop (onChange: () => void) {
  const media = window.matchMedia(desktopQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function PortfolioRail ({ children }: { children: ReactNode[] }) {
  const target = useRef<HTMLDivElement>(null)
  const lastScrollIndex = useRef<number | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const { enabled } = useDesignMotion()
  const desktop = useSyncExternalStore(subscribeDesktop, () => window.matchMedia(desktopQuery).matches, () => false)
  const linked = desktop && enabled
  const { scrollYProgress } = useScroll({ target, offset: ['start 112px', 'end end'] })

  const syncScroll = useCallback((progress: number) => {
    if (!linked || !api) return
    const index = Math.round(progress * (api.scrollSnapList().length - 1))
    if (lastScrollIndex.current === index) return
    lastScrollIndex.current = index
    // Manual navigation and focused artwork take priority over scroll-driven selection.
    if (target.current?.contains(document.activeElement)) return
    if (api.selectedScrollSnap() !== index) api.scrollTo(index)
  }, [api, linked])

  useMotionValueEvent(scrollYProgress, 'change', syncScroll)
  useEffect(() => {
    lastScrollIndex.current = null
    syncScroll(scrollYProgress.get())
  }, [syncScroll, scrollYProgress])

  return (
    <div ref={target} data-scroll-gallery={linked ? 'linked' : 'manual'} className={cn('relative', linked && 'h-[180svh]')}>
      <div className={cn(linked && 'sticky top-[calc(var(--design-header-height)+1rem)]')}>
        <Carousel
          setApi={setApi}
          opts={{ align: 'start', loop: false, duration: enabled ? 25 : 0 }}
          aria-label="Selected tattoo projects"
          className="min-w-0"
        >
          <CarouselContent className="-ml-5 items-start py-1">
            {children.map((child, index) => (
              <CarouselItem key={index} aria-label={'Selected work ' + (index + 1) + ' of ' + children.length} className="max-w-[calc(min(45svh,420px)+1.25rem)] basis-[86%] pl-5 sm:basis-[58%] lg:basis-[44%]">
                {child}
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              {linked ? <><ArrowDown size={16} aria-hidden="true" />Scroll to explore</> : 'Swipe or use the arrows to explore'}
            </p>
            <div className="flex items-center gap-3">
              <CarouselPrevious className="static translate-x-0 translate-y-0" />
              <CarouselNext className="static translate-x-0 translate-y-0" />
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  )
}

export default function PortfolioPreview ({ children }: { children: ReactNode[] }) {
  const [expanded, setExpanded] = useState(false)
  const expansionId = useId()

  return (
    <>
      <PortfolioRail>{children.slice(0, 4)}</PortfolioRail>
      <div className="my-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <p className="font-mono text-xs text-muted-foreground">{expanded ? children.length : 4} of {children.length} original works</p>
        <Button variant="outline" aria-expanded={expanded} aria-controls={expansionId} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show fewer projects' : 'View more projects'}<ArrowRight data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
      <div id={expansionId} hidden={!expanded}>{expanded ? <MasonryGrid>{children.slice(4)}</MasonryGrid> : null}</div>
    </>
  )
}
