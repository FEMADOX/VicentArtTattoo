import { Code2 } from 'lucide-react'
import { navigation } from '@/common'
import { MobileNavbar } from '@/components/MobileNavbar'
import { Button } from '@/components/ui/button'
import { useNavigation } from '@/hooks/useNavigation'

export const NavigationBar = () => {
  const { currentSection } = useNavigation()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-10">
        <MobileNavbar />
        <a href="#home" aria-label="VicentArt home" className="flex min-h-11 items-center font-display text-2xl uppercase tracking-widest">
          VicentArt
        </a>
        <ul className="hidden items-center gap-2 md:flex">
          {navigation.map(({ name, href }) => (
            <li key={href}>
              <Button asChild variant="ghost" className="font-mono text-xs uppercase">
                <a href={href} aria-current={href === `#${currentSection}` ? 'location' : undefined}>
                  {name}
                </a>
              </Button>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" size="icon">
          <a href="https://github.com/FEMADOX/VicentArtTattoo" aria-label="View the VicentArtTattoo source on GitHub">
            <Code2 aria-hidden="true" />
          </a>
        </Button>
      </nav>
    </header>
  )
}
