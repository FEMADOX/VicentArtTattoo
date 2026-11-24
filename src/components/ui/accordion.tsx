import * as React from "react"
import cn from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>

const Accordion = ({
  ...props
}: AccordionProps) => 
  <AccordionPrimitive.Root data-slot="accordion" {...props} />


type AccordionItemProps = React.ComponentProps<typeof AccordionPrimitive.Item>

const AccordionItem = ({
  className,
  ...props
}: AccordionItemProps) => 
  (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )


type AccordionTriggerProps = React.ComponentProps<typeof AccordionPrimitive.Trigger>

const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionTriggerProps) => 
  (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex min-h-11 flex-1 items-center justify-between gap-6 py-5 text-left font-display text-2xl font-normal tracking-wide text-foreground transition-colors duration-150 outline-none hover:text-body focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-240" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )


type AccordionContentProps = React.ComponentProps<typeof AccordionPrimitive.Content>

const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionContentProps) => 
  (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden font-body text-lg leading-relaxed text-body duration-240 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )


export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
