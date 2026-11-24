import { ArrowRight } from 'lucide-react'
import siteStyles from '@/styles/site'
import { address } from '@/content/site'

type SiteFooterProps = { home: boolean }

const SiteFooter = ({ home }: SiteFooterProps) => (
  <footer className={`${siteStyles.container} flex flex-wrap items-center justify-between gap-8 border-t border-border py-12 max-[720px]:flex-col max-[720px]:items-start max-[720px]:py-8`}>
    <a className={siteStyles.brand} href={home ? '#home' : '/'}>VicentArt</a>
    <address className="max-w-[30ch] text-muted-foreground">{address}</address>
    <a className={siteStyles.textLink} href={home ? '#contact' : '/#contact'}>Contact the artist<ArrowRight size={16} aria-hidden="true" /></a>
  </footer>
)

export default SiteFooter
