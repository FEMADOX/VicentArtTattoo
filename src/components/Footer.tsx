import { Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Footer = () => (
  <footer className="border-t border-border px-5 py-10 md:px-10">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
      <p className="text-base text-muted-foreground">© 2025 Vicentart. All rights reserved.</p>
      <Button asChild variant="outline" size="icon">
        <a href="https://github.com/FEMADOX" aria-label="View FEMADOX on GitHub">
          <Code2 aria-hidden="true" />
        </a>
      </Button>
    </div>
  </footer>
)
