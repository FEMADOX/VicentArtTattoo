import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border font-mono text-xs font-normal uppercase tracking-[0.14em] transition-colors duration-150 outline-none disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring data-[preview-state=focus]:outline-2 data-[preview-state=focus]:outline-solid data-[preview-state=focus]:outline-offset-4 data-[preview-state=focus]:outline-ring aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'border-foreground bg-transparent text-foreground hover:bg-foreground/10 active:bg-foreground/20 data-[preview-state=hover]:bg-foreground/10 data-[preview-state=pressed]:bg-foreground/20',
        destructive: 'border-destructive bg-transparent text-destructive hover:bg-destructive/10 active:bg-destructive/20 data-[preview-state=hover]:bg-destructive/10 data-[preview-state=pressed]:bg-destructive/20',
        outline: 'border-input bg-transparent text-foreground hover:border-foreground hover:bg-accent active:bg-secondary data-[preview-state=hover]:border-foreground data-[preview-state=hover]:bg-accent data-[preview-state=pressed]:bg-secondary',
        secondary: 'border-input bg-secondary text-secondary-foreground hover:bg-accent active:bg-popover data-[preview-state=hover]:bg-accent data-[preview-state=pressed]:bg-popover',
        ghost: 'border-transparent bg-transparent text-foreground hover:bg-accent active:bg-secondary data-[preview-state=hover]:bg-accent data-[preview-state=pressed]:bg-secondary',
        link: 'border-transparent bg-transparent text-link underline underline-offset-4 hover:text-foreground active:text-body data-[preview-state=hover]:text-foreground data-[preview-state=pressed]:text-body'
      },
      size: {
        default: 'h-11 px-6 py-3 has-[>svg]:px-5',
        sm: 'h-11 gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 px-8 has-[>svg]:px-6',
        icon: 'size-11'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

function Button ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    'data-preview-state'?: 'normal' | 'hover' | 'focus' | 'pressed' | 'disabled'
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// oxlint-disable-next-line react/only-export-components -- shadcn exposes its variant helper alongside Button.
export { Button, buttonVariants }
