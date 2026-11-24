import type { ComponentProps } from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'
import cn from '@/lib/utils'

type TabsProps = ComponentProps<typeof TabsPrimitive.Root>

const Tabs = ({ className, ...props }: TabsProps) => 
  <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-6', className)} {...props} />


type TabsListProps = ComponentProps<typeof TabsPrimitive.List>

const TabsList = ({ className, ...props }: TabsListProps) => 
  <TabsPrimitive.List data-slot="tabs-list" className={cn('flex w-fit max-w-full flex-wrap gap-2 border-b border-border', className)} {...props} />


type TabsTriggerProps = ComponentProps<typeof TabsPrimitive.Trigger>

const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => 
  <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn('inline-flex min-h-11 items-center justify-center border-b-2 border-transparent px-4 py-2 text-base text-body transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 data-[state=active]:border-foreground data-[state=active]:text-foreground', className)} {...props} />


type TabsContentProps = ComponentProps<typeof TabsPrimitive.Content>

const TabsContent = ({ className, ...props }: TabsContentProps) => 
  <TabsPrimitive.Content data-slot="tabs-content" className={cn('min-w-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring', className)} {...props} />


export { Tabs, TabsList, TabsTrigger, TabsContent }
