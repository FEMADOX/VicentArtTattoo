import type { KeyboardEvent, ReactNode, RefObject } from 'react'
import * as motion from 'motion/react-m'
import { X } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../components/ui/dialog'
import { useDesignMotion } from './motion'
import { designStyles } from './styles'

type DesignDialogProps = {
  title: string
  image: { src: string, alt: string, width: number, height: number }
  caption?: string
  body?: ReactNode
  children?: ReactNode
  open: boolean
  onClose: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export function DesignDialog ({ title, image, caption = image.alt, body, children, open, onClose, onKeyDown, returnFocusRef }: DesignDialogProps) {
  const { enabled } = useDesignMotion()
  return (
    <Dialog open={open} onOpenChange={next => { if (!next) onClose() }}>
      <DialogContent
        className={designStyles.lightbox}
        showCloseButton={false}
        onKeyDown={onKeyDown}
        onCloseAutoFocus={event => {
          event.preventDefault()
          returnFocusRef.current?.focus({ preventScroll: true })
        }}
      >
        <div className={designStyles.lightboxHeader}>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild><Button variant="ghost" size="icon" aria-label="Close dialog"><X aria-hidden="true" /></Button></DialogClose>
        </div>
        <DialogDescription className="sr-only">The complete original photograph. Press Escape or use Close dialog to return to the page.</DialogDescription>
        <div className={designStyles.lightboxFrame}>
          {body ?? <motion.img key={image.src} className={designStyles.lightboxImage} src={image.src} alt={image.alt} width={image.width} height={image.height} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: enabled ? 0.15 : 0 }} />}
        </div>
        <div className={designStyles.lightboxFooter}>
          <p className={designStyles.lightboxCaption} aria-live="polite">{caption}</p>
          {children ?? <DialogClose asChild><Button variant="outline" className="justify-self-end">Close image</Button></DialogClose>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
