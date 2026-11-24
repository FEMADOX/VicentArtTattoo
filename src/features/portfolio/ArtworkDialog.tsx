import type { KeyboardEvent, ReactNode } from 'react'
import * as motion from 'motion/react-m'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useSiteMotion } from '@/motion/useSiteMotion'
import portfolioStyles from './styles'

type ArtworkDialogProps = {
  title: string
  image: { src: string, alt: string, width: number, height: number }
  caption?: string
  children?: ReactNode
  actions?: ReactNode
  open: boolean
  onClose: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void
  returnFocus: () => void
}

const ArtworkDialog = ({ title, image, caption = image.alt, children, actions, open, onClose, onKeyDown, returnFocus }: ArtworkDialogProps) => {
  const { enabled } = useSiteMotion()
  return (
    <Dialog open={open} onOpenChange={next => { if (!next) onClose() }}>
      <DialogContent
        className={portfolioStyles.lightbox}
        showCloseButton={false}
        onKeyDown={onKeyDown}
        onCloseAutoFocus={event => {
          event.preventDefault()
          returnFocus()
        }}
      >
        <div className={portfolioStyles.lightboxHeader}>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild><Button variant="ghost" size="icon" aria-label="Close dialog"><X aria-hidden="true" /></Button></DialogClose>
        </div>
        <DialogDescription className="sr-only">Explore this tattoo work. Press Escape or use Close dialog to return to the page.</DialogDescription>
        <div className={portfolioStyles.lightboxFrame}>
          {children ?? <motion.img key={image.src} className={portfolioStyles.lightboxImage} src={image.src} alt={image.alt} width={image.width} height={image.height} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: enabled ? 0.15 : 0 }} />}
        </div>
        <div className={portfolioStyles.lightboxFooter}>
          <p className={portfolioStyles.lightboxCaption} aria-live="polite">{caption}</p>
          {actions ?? <DialogClose asChild><Button variant="outline" className="justify-self-end">Close image</Button></DialogClose>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ArtworkDialog
