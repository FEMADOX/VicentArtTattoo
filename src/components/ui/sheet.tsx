import * as React from "react"
import cn from "@/lib/utils"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"

type SheetProps = React.ComponentProps<typeof SheetPrimitive.Root>

const Sheet = ({ ...props }: SheetProps) => 
  <SheetPrimitive.Root data-slot="sheet" {...props} />


type SheetTriggerProps = React.ComponentProps<typeof SheetPrimitive.Trigger>

const SheetTrigger = ({
  ...props
}: SheetTriggerProps) => 
  <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />


type SheetCloseProps = React.ComponentProps<typeof SheetPrimitive.Close>

const SheetClose = ({
  ...props
}: SheetCloseProps) => 
  <SheetPrimitive.Close data-slot="sheet-close" {...props} />


type SheetPortalProps = React.ComponentProps<typeof SheetPrimitive.Portal>

const SheetPortal = ({
  ...props
}: SheetPortalProps) => 
  <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />


type SheetOverlayProps = React.ComponentProps<typeof SheetPrimitive.Overlay>

const SheetOverlay = ({
  className,
  ...props
}: SheetOverlayProps) => 
  (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-80 bg-black/85 duration-240 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )


type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}

const SheetContent = ({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetContentProps) => 
  (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-81 flex max-h-dvh flex-col gap-6 overflow-y-auto bg-popover text-body duration-240 ease-out data-[state=closed]:animate-out data-[state=open]:animate-in",
          side === "right" &&
            "inset-y-0 right-0 h-dvh w-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md",
          side === "left" &&
            "inset-y-0 left-0 h-dvh w-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-md",
          side === "top" &&
            "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full border border-input bg-popover text-foreground transition-colors duration-150 hover:bg-accent focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )


type SheetHeaderProps = React.ComponentProps<"div">

const SheetHeader = ({ className, ...props }: SheetHeaderProps) => 
  (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-3 p-6 pr-16", className)}
      {...props}
    />
  )


type SheetFooterProps = React.ComponentProps<"div">

const SheetFooter = ({ className, ...props }: SheetFooterProps) => 
  (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-3 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]", className)}
      {...props}
    />
  )


type SheetTitleProps = React.ComponentProps<typeof SheetPrimitive.Title>

const SheetTitle = ({
  className,
  ...props
}: SheetTitleProps) => 
  (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-display text-3xl font-normal uppercase tracking-wider text-foreground", className)}
      {...props}
    />
  )


type SheetDescriptionProps = React.ComponentProps<typeof SheetPrimitive.Description>

const SheetDescription = ({
  className,
  ...props
}: SheetDescriptionProps) => 
  (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("font-body text-lg leading-relaxed text-body", className)}
      {...props}
    />
  )


export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
