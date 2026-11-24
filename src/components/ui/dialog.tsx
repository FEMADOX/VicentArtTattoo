import * as React from "react"
import cn from "@/lib/utils"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>

const Dialog = ({
  ...props
}: DialogProps) => 
  <DialogPrimitive.Root data-slot="dialog" {...props} />


type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>

const DialogTrigger = ({
  ...props
}: DialogTriggerProps) => 
  <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />


type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>

const DialogPortal = ({
  ...props
}: DialogPortalProps) => 
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />


type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>

const DialogClose = ({
  ...props
}: DialogCloseProps) => 
  <DialogPrimitive.Close data-slot="dialog-close" {...props} />


type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>

const DialogOverlay = ({
  className,
  ...props
}: DialogOverlayProps) => 
  (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-80 bg-black/85 duration-240 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )


type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) => 
  (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-81 grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-275 -translate-x-1/2 -translate-y-1/2 gap-6 overflow-y-auto border bg-popover p-6 text-body duration-240 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full border border-input bg-popover text-foreground transition-colors duration-150 hover:bg-accent focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )


type DialogHeaderProps = React.ComponentProps<"div">

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => 
  (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )


type DialogFooterProps = React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}

const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps) => 
  (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )


type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>

const DialogTitle = ({
  className,
  ...props
}: DialogTitleProps) => 
  (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-display text-3xl leading-tight font-normal uppercase tracking-wider text-foreground", className)}
      {...props}
    />
  )


type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>

const DialogDescription = ({
  className,
  ...props
}: DialogDescriptionProps) => 
  (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("font-body text-lg leading-relaxed text-body", className)}
      {...props}
    />
  )


export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
