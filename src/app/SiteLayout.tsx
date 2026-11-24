import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { SiteMotion, ScrollProgressBar } from '@/motion/SiteMotion'
import siteStyles from '@/styles/site'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

type SiteLayoutProps = {
  home: boolean
  children: ReactNode
}

const SiteLayout = ({ home, children }: SiteLayoutProps) => {
  useEffect(() => {
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
  }, [])

  return (
    <SiteMotion enabled={home}>
      <div className={siteStyles.preview} data-motion={home}>
        <ScrollProgressBar />
        <a className="absolute top-2 left-4 z-100 translate-y-[-200%] bg-primary p-4 font-mono text-sm text-primary-foreground focus:translate-y-0" href="#main-content">Skip to content</a>
        <SiteHeader home={home} />
        {children}
        <SiteFooter home={home} />
      </div>
    </SiteMotion>
  )
}

export default SiteLayout
