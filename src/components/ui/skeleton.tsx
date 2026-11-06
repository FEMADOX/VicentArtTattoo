import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

function Skeleton ({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="skeleton" aria-hidden="true" className={cn('bg-muted motion-safe:animate-pulse', className)} />
}

export { Skeleton }
