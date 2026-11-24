import { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig, useScroll, useSpring } from 'motion/react'
import * as m from 'motion/react-m'
import { SiteMotionContext, useSiteMotion } from './useSiteMotion'

const loadFeatures = async () => (await import('./motion-features')).default

function subscribeReducedMotion (onChange: () => void) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  preference.addEventListener('change', onChange)
  return () => preference.removeEventListener('change', onChange)
}

function prefersReducedMotion () {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

type SiteMotionProps = {
  enabled: boolean
  children: ReactNode
}

export const SiteMotion = ({ enabled, children }: SiteMotionProps) => {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => true)
  if (!enabled) return <>{children}</>
  return <SiteMotionContext.Provider value={!reducedMotion}><MotionConfig reducedMotion="user"><LazyMotion features={loadFeatures} strict>{children}</LazyMotion></MotionConfig></SiteMotionContext.Provider>
}

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001, skipInitialAnimation: true })
  return <m.div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-foreground" style={{ scaleX }} aria-hidden="true" />
}

export const ScrollProgressBar = () => {
  const { enabled } = useSiteMotion()
  return enabled ? <ScrollProgress /> : null
}
