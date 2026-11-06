import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { Slider } from '../components/ui/slider'
import { designStyles } from '../designs/styles'
import { cn } from '../lib/utils'

const states = ['normal', 'hover', 'focus', 'pressed', 'disabled'] as const

export default function ComponentShowcase () {
  const [lastAction, setLastAction] = useState('No action yet.')
  const [speed, setSpeed] = useState([1])

  return (
    <main id="main-content" tabIndex={-1} className={cn(designStyles.container, 'py-12')}>
      <h1 className="text-4xl font-medium tracking-tight">Shared components</h1>
      <p className="mt-4 max-w-prose text-muted-foreground">Pinned states use the same variants as the site. Every enabled specimen also responds to pointer and keyboard input.</p>
      <section className="mt-12" aria-labelledby="button-specimens">
        <h2 id="button-specimens" className="text-2xl font-medium">Buttons</h2>
        <div className="mt-6 grid gap-8">
          {(['default', 'outline'] as const).map(variant => (
            <div key={variant}>
              <h3 className="mb-4 text-lg">{variant === 'default' ? 'Primary' : 'Outline'}</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {states.map(state => (
                  <div key={state} className="flex min-w-0 flex-col items-start gap-3">
                    <span className="text-sm capitalize text-muted-foreground">{state}</span>
                    <Button variant={variant} data-preview-state={state} disabled={state === 'disabled'} onClick={() => setLastAction((variant === 'default' ? 'Primary' : 'Outline') + ' / ' + state + ' activated.')}>View work<ArrowRight data-icon="inline-end" /></Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-4"><Button size="sm" onClick={() => setLastAction('Small button activated.')}>Small</Button><Button onClick={() => setLastAction('Default button activated.')}>Default</Button><Button size="lg" onClick={() => setLastAction('Large button activated.')}>Large</Button><Button size="icon" aria-label="Next specimen" onClick={() => setLastAction('Icon button activated.')}><ArrowRight /></Button></div>
        </div>
        <p className="mt-6 min-h-6 text-sm text-muted-foreground" role="status">{lastAction}</p>
      </section>
      <section className="mt-16" aria-labelledby="overlay-specimens">
        <h2 id="overlay-specimens" className="text-2xl font-medium">Dialog and sheet</h2>
        <p className="mt-3 text-muted-foreground">Open either control to check focus trapping, Escape and focus return.</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Dialog><DialogTrigger asChild><Button>Open sample dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Original tattoo work</DialogTitle><DialogDescription>A local specimen for testing the shared dialog behavior.</DialogDescription></DialogHeader><Button variant="outline" onClick={() => setLastAction('Dialog action activated.')}>Test dialog action</Button></DialogContent></Dialog>
          <Sheet><SheetTrigger asChild><Button variant="outline">Open sample sheet</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Menu specimen</SheetTitle><SheetDescription>A local specimen for testing the mobile navigation surface.</SheetDescription></SheetHeader><Button variant="outline" onClick={() => setLastAction('Sheet action activated.')}>Test sheet action</Button></SheetContent></Sheet>
        </div>
      </section>
      <section className="mt-16 max-w-2xl" aria-labelledby="accordion-specimens">
        <h2 id="accordion-specimens" className="text-2xl font-medium">Accordion</h2>
        <Accordion className="mt-6" type="single" collapsible>
          <AccordionItem value="booking"><AccordionTrigger>How does booking work?</AccordionTrigger><AccordionContent>Prepare your idea, placement, approximate size and reference images before contacting the artist.</AccordionContent></AccordionItem>
          <AccordionItem value="disabled" disabled><AccordionTrigger>Disabled specimen</AccordionTrigger><AccordionContent>This item is disabled.</AccordionContent></AccordionItem>
        </Accordion>
      </section>
      <section className="mt-16 max-w-2xl" aria-labelledby="slider-specimens">
        <h2 id="slider-specimens" className="text-2xl font-medium">Slider</h2>
        <p id="catalog-speed-label" className="mt-6 text-sm">Drawing speed: {speed[0]} times normal</p>
        <Slider className="mt-3" aria-labelledby="catalog-speed-label" value={speed} min={0.25} max={2} step={0.25} onValueChange={setSpeed} />
        <p id="catalog-disabled-speed-label" className="mt-6 text-sm text-muted-foreground">Disabled drawing speed</p>
        <Slider className="mt-3" aria-labelledby="catalog-disabled-speed-label" defaultValue={[1]} min={0.25} max={2} step={0.25} disabled />
      </section>
    </main>
  )
}
