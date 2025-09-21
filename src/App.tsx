import './App.css'
import {
  AboutSection,
  ContactSection,
  Footer,
  HomeSection,
  NavigationBar,
  PortfolioSection
} from '@/components'

function App() {
  return (
    <div className="relative bg-[url('assets/images/Background.webp')] bg-fixed bg-black min-h-screen min-w-dvw bg-no-repeat bg-center bg-size-[contain] md:bg-repeat-space">
      <div className="min-w-dvw flex flex-col items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <NavigationBar />

        <HomeSection />

        <PortfolioSection />

        <ContactSection />

        <AboutSection />

        <Footer />
      </div>
    </div>
  )
}

export default App
