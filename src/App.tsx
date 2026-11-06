import { NavigationBar } from '@/components/NavigationBar'
import { HomeSection } from '@/components/HomeSection'
import { PortfolioSection } from '@/components/PortfolioSection'
import { ContactSection } from '@/components/ContactSection'
import { AboutSection } from '@/components/AboutSection'
import { Footer } from '@/components/Footer'

const App = () => (
  <div className="min-h-screen bg-background font-body text-foreground">
    <a className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-6 focus:py-3 focus:text-foreground" href="#main-content">
      Skip to content
    </a>
    <NavigationBar />
    <main id="main-content">
      <HomeSection />
      <PortfolioSection />
      <ContactSection />
      <AboutSection />
    </main>
    <Footer />
  </div>
)

export default App
