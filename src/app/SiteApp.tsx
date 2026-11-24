import { useEffect } from 'react'
import type { SiteRoute } from './routes'
import SiteLayout from './SiteLayout'
import HomePage from './HomePage'
import NotFoundPage from './NotFoundPage'

type SitePageRoute = Exclude<SiteRoute, { type: 'redirect', section: string }>

function usePageMetadata (route: SitePageRoute) {
  useEffect(() => {
    if (route.type === 'home') return
    const previousTitle = document.title
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previousContent = existing?.content
    const robots = existing ?? document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    if (!existing) document.head.append(robots)
    document.title = 'Page not found | VicentArt'
    return () => {
      document.title = previousTitle
      if (previousContent !== undefined) robots.content = previousContent
      else robots.remove()
    }
  }, [route.type])
}

type SiteAppProps = { route: SitePageRoute }

const SiteApp = ({ route }: SiteAppProps) => {
  usePageMetadata(route)
  const home = route.type === 'home'
  return <SiteLayout home={home}>{home ? <HomePage /> : <NotFoundPage />}</SiteLayout>
}

export default SiteApp
