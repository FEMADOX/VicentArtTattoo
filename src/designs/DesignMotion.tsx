import { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig, useScroll, useSpring } from 'motion/react'
import * as m from 'motion/react-m'
import { DesignMotionContext, useDesignMotion } from './motion'

const loadFeatures = async () => (await import('./motion-features')).default

function subscribeReducedMotion (onChange: () => void) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', onChange)
  return () => preference.removeEventListener('change', onChange)
}

function prefersReducedMotion () {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function DesignMotion ({ enabled, children }: { enabled: boolean, children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => true)
  if (!enabled) return <>{children}</>
  return <DesignMotionContext.Provider value={!reducedMotion}><MotionConfig reducedMotion="user"><LazyMotion features={loadFeatures} strict>{children}</LazyMotion></MotionConfig></DesignMotionContext.Provider>
}

function ScrollProgress () {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001, skipInitialAnimation: true })
  return <m.div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-foreground" style={{ scaleX }} aria-hidden="true" />
}

export function DesignProgress () {
  const { enabled } = useDesignMotion()
  return enabled ? <ScrollProgress /> : null
}
