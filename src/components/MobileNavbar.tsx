import { Menu } from 'lucide-react'
import { useState } from 'react'
import { navigation } from '@/common'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

export const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open navigation">
            <Menu aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-background text-foreground">
          <SheetHeader>
            <SheetTitle className="font-display text-3xl uppercase">VicentArt</SheetTitle>
            <SheetDescription>Explore the portfolio, contact details and artist.</SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="px-4">
            <ul className="space-y-2">
              {navigation.map(({ name, href }) => (
                <li key={href}>
                  <SheetClose asChild>
                    <a className="flex min-h-11 items-center border-b border-border py-3 font-mono text-sm uppercase hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring" href={href}>
                      {name}
                    </a>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
