import { Button } from '@/components/ui/button'
import siteStyles from '@/styles/site'

const NotFoundPage = () => (
  <main id="main-content" tabIndex={-1} className={`${siteStyles.container} py-24`}>
    <h1 className="mb-6 text-[clamp(2rem,5vw,4rem)]">Page not found</h1>
    <p className={siteStyles.copy}>Explore Vicent&apos;s work and contact the artist.</p>
    <Button asChild className="mt-8"><a href="/">Back to VicentArt</a></Button>
  </main>
)

export default NotFoundPage
