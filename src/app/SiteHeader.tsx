import { useRef, useState } from 'react'
import * as m from 'motion/react-m'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useSiteMotion } from '@/motion/useSiteMotion'
import siteStyles from '@/styles/site'

const navigation = [
  { label: 'Work', href: '#portfolio' },
  { label: 'Artist', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Contact the artist', href: '#contact' }
]

type SiteNavigationProps = {
  home: boolean
  onNavigate?: (href: string) => void
  menu?: boolean
}

const SiteNavigation = ({ home, onNavigate, menu = false }: SiteNavigationProps) => (
  <nav className={menu ? 'flex flex-col items-stretch gap-3' : 'flex items-center gap-4'} aria-label="Main navigation">{navigation.map((link, index) => {
    const href = (home ? '' : '/') + link.href
    return <Button key={link.href} asChild variant={index === navigation.length - 1 ? 'outline' : 'link'} className={menu ? 'justify-start' : undefined}><a href={href} onClick={() => onNavigate?.(href)}>{link.label}</a></Button>
  })}
  </nav>
)

type SiteHeaderProps = { home: boolean }

const SiteHeader = ({ home }: SiteHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const destination = useRef<HTMLElement | null>(null)
  const { intro } = useSiteMotion()

  function navigate (href: string) {
    destination.current = href.startsWith('#') ? document.getElementById(href.slice(1)) : null
    setMenuOpen(false)
  }

  return (
    <m.header {...intro()} className="sticky top-0 z-40 border-b border-border bg-background">
      <div className={`${siteStyles.container} flex min-h-(--design-header-height) items-center justify-between gap-6`}>
        <a className={siteStyles.brand} href={home ? '#home' : '/'} aria-label="VicentArt home"><img src="/logo.svg" width={44} height={44} alt="" /><span>VicentArt</span></a>
        <div className="max-[900px]:hidden"><SiteNavigation home={home} /></div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild><Button variant="outline" className="min-[901px]:hidden"><Menu data-icon="inline-start" aria-hidden="true" />Menu</Button></SheetTrigger>
          <SheetContent onCloseAutoFocus={event => {
            const target = destination.current
            destination.current = null
            if (target) {
              event.preventDefault()
              target.tabIndex = -1
              target.focus({ preventScroll: true })
              target.scrollIntoView()
            }
          }}
          >
            <SheetHeader><SheetTitle>Menu</SheetTitle><SheetDescription>Explore the work and contact Vicent.</SheetDescription></SheetHeader>
            <div className="p-6"><SiteNavigation home={home} menu onNavigate={navigate} /></div>
          </SheetContent>
        </Sheet>
      </div>
    </m.header>
  )
}

export default SiteHeader
