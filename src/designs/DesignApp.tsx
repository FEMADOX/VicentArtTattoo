import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import * as m from 'motion/react-m'
import { ArrowRight, Menu } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'
import { DesignMotion, DesignProgress } from './DesignMotion'
import { useDesignMotion } from './motion'
import { address } from './content'
import type { DesignRoute } from './routes'
import SinglePageDesign from './SinglePageDesign'
import { cn } from '../lib/utils'
import { designStyles } from './styles'
import { ContentSkeleton } from '../components/ContentSkeleton'

type SiteRoute = Exclude<DesignRoute, { type: 'redirect', section: string }>
const InkStudyPage = lazy(async () => await import('./InkStudyPage'))
const navigation = [
  { label: 'Work', href: '#portfolio' },
  { label: 'Artist', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Contact the artist', href: '#contact' }
]

function SiteNavigation ({ home, onNavigate, menu = false }: { home: boolean, onNavigate?: (href: string) => void, menu?: boolean }) {
  return (
    <nav className={menu ? 'flex flex-col items-stretch gap-3' : 'flex items-center gap-4'} aria-label="Main navigation">{navigation.map((link, index) => {
      const href = (home ? '' : '/') + link.href
      return <Button key={link.href} asChild variant={index === navigation.length - 1 ? 'outline' : 'link'} className={menu ? 'justify-start' : undefined}><a href={href} onClick={() => onNavigate?.(href)}>{link.label}</a></Button>
    })}
    </nav>
  )
}

function Header ({ home }: { home: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const destination = useRef<HTMLElement | null>(null)
  const { intro } = useDesignMotion()

  function navigate (href: string) {
    destination.current = href.startsWith('#') ? document.getElementById(href.slice(1)) : null
    setMenuOpen(false)
  }

  return (
    <m.header {...intro()} className="sticky top-0 z-40 border-b border-border bg-background">
      <div className={cn(designStyles.container, 'flex min-h-(--design-header-height) items-center justify-between gap-6')}>
        <a className={designStyles.brand} href={home ? '#home' : '/'} aria-label="VicentArt home"><img src="/logo.svg" width={44} height={44} alt="" /><span>VicentArt</span></a>
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

function SiteContent ({ route }: { route: SiteRoute }) {
  switch (route.type) {
    case 'home': return <SinglePageDesign design="a" />
    case 'ink-study': return <Suspense fallback={<ContentSkeleton view="ink-study" />}><InkStudyPage /></Suspense>
    case 'not-found': return <main id="main-content" tabIndex={-1} className={cn(designStyles.container, 'py-24')}><h1 className="mb-6 text-[clamp(2rem,5vw,4rem)]">Page not found</h1><p className={designStyles.copy}>Explore Vicent&apos;s work and contact the artist.</p><Button asChild className="mt-8"><a href="/">Back to VicentArt</a></Button></main>
  }
}

function usePageMetadata (route: SiteRoute) {
  useEffect(() => {
    if (route.type === 'home') return
    const previousTitle = document.title
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previousContent = existing?.content
    const robots = existing ?? document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    if (!existing) document.head.append(robots)
    document.title = (route.type === 'ink-study' ? 'Ink animation study' : 'Page not found') + ' | VicentArt'
    return () => {
      document.title = previousTitle
      if (previousContent !== undefined) robots.content = previousContent
      else robots.remove()
    }
  }, [route.type])
}

export function DesignFrame ({ home = true, animated = true, children }: { home?: boolean, animated?: boolean, children: ReactNode }) {
  useEffect(() => {
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
  }, [])
  return (
    <DesignMotion enabled={animated}>
      <div className={designStyles.preview} data-motion={animated}>
        <DesignProgress />
        <a className="absolute top-2 left-4 z-100 translate-y-[-200%] bg-primary p-4 font-mono text-sm text-primary-foreground focus:translate-y-0" href="#main-content">Skip to content</a>
        <Header home={home} />
        {children}
        <footer className={cn(designStyles.container, 'flex flex-wrap items-center justify-between gap-8 border-t border-border py-12 max-[720px]:flex-col max-[720px]:items-start max-[720px]:py-8')}>
          <a className={designStyles.brand} href={home ? '#home' : '/'}>VicentArt</a>
          <address className="max-w-[30ch] text-muted-foreground">{address}</address>
          <a className={designStyles.textLink} href={home ? '#contact' : '/#contact'}>Contact the artist<ArrowRight size={16} aria-hidden="true" /></a>
        </footer>
      </div>
    </DesignMotion>
  )
}

export default function DesignApp ({ route }: { route: SiteRoute }) {
  usePageMetadata(route)
  return <DesignFrame home={route.type === 'home'} animated={route.type !== 'not-found'}><SiteContent route={route} /></DesignFrame>
}
