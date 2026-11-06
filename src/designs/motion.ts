import { createContext, useContext } from 'react'
import type { MotionProps } from 'motion/react'

export const DesignMotionContext = createContext(false)
const ease = [0.22, 1, 0.36, 1] as const
const visible = { opacity: 1, y: 0 }

export function useDesignMotion () {
  const enabled = useContext(DesignMotionContext)

  function intro (delay = 0): MotionProps {
    if (!enabled) return { initial: false, animate: visible, transition: { duration: 0 } }
    return { initial: { opacity: 0, y: 24 }, animate: visible, transition: { duration: 0.5, delay, ease } }
  }

  function reveal (delay = 0): MotionProps {
    if (!enabled) return { initial: false, animate: visible, transition: { duration: 0 } }
    return { initial: { opacity: 0, y: 30 }, whileInView: visible, viewport: { once: true, amount: 0.12, margin: '0px 0px -24px 0px' }, transition: { duration: 0.5, delay, ease } }
  }

  function image (delay = 0): MotionProps {
    if (!enabled) return { initial: false, animate: { ...visible, clipPath: 'none' }, transition: { duration: 0 } }
    return { initial: { opacity: 0, y: 16, clipPath: 'inset(0% 0% 100% 0%)' }, animate: { ...visible, clipPath: 'inset(0% 0% 0% 0%)', transitionEnd: { clipPath: 'none' } }, transition: { duration: 0.5, delay, ease } }
  }

  const hover: MotionProps = enabled
    ? { whileHover: { y: -2, transition: { duration: 0.15, ease } }, whileTap: { scale: 0.985, transition: { duration: 0.15 } } }
    : { whileHover: { y: 0, transition: { duration: 0 } }, whileTap: { scale: 1, transition: { duration: 0 } } }

  return { enabled, intro, reveal, image, hover }
}
