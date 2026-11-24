import type { ComponentProps } from 'react'
import cn from '../../lib/utils'

type SkeletonProps = ComponentProps<'div'>

const Skeleton = ({ className, ...props }: SkeletonProps) => 
  <div {...props} data-slot="skeleton" aria-hidden="true" className={cn('bg-muted motion-safe:animate-pulse', className)} />


export default Skeleton
