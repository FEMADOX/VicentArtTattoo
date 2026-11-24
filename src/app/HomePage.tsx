import HeroSection from '@/sections/HeroSection'
import PortfolioSection from '@/sections/PortfolioSection'
import AboutSection from '@/sections/AboutSection'
import ProcessSection from '@/sections/ProcessSection'
import ContactSection from '@/sections/ContactSection'

const HomePage = () => (
  <main id="main-content" tabIndex={-1} className="bg-background text-foreground">
    <HeroSection />
    <PortfolioSection />
    <AboutSection />
    <ProcessSection />
    <ContactSection />
  </main>
)

export default HomePage
