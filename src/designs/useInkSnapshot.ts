import { useCallback, useSyncExternalStore } from 'react'
import type { MotionValue } from 'motion/react'

export function useInkSnapshot<T> (value: MotionValue<T>): T {
  const subscribe = useCallback((notify: () => void) => value.on('change', notify), [value])
  const snapshot = useCallback(() => value.get(), [value])
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}
