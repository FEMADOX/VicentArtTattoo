import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export default function MasonryGrid ({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const grid = ref.current
    if (!grid || typeof ResizeObserver === 'undefined') return

    const cards = Array.from(grid.children).filter((child): child is HTMLElement => child instanceof HTMLElement)
    const previousSpans = cards.map(card => card.style.gridRowEnd)

    function measure () {
      if (!grid) return
      const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || 0
      // Layout height stays stable while Motion transforms a card.
      const spans = cards.map(card => Math.ceil(card.offsetHeight + gap))
      cards.forEach((card, index) => {
        card.style.gridRowEnd = 'span ' + spans[index]
      })
      grid.dataset.masonry = 'true'
    }

    measure()
    const observer = new ResizeObserver(measure)
    cards.forEach(card => observer.observe(card))

    return () => {
      observer.disconnect()
      delete grid.dataset.masonry
      cards.forEach((card, index) => {
        card.style.gridRowEnd = previousSpans[index]
      })
    }
  }, [children])

  return <div ref={ref} className="grid grid-cols-3 items-start gap-8 data-[masonry=true]:auto-rows-0.25 data-[masonry=true]:gap-y-0 *:min-w-0 *:self-start [@media(width<=1000px)]:grid-cols-2 [@media(width<=1000px)]:gap-6 [@media(width<=720px)]:grid-cols-1">{children}</div>
}
