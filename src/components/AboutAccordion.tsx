import { accordionData } from '@/common'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const AboutAccordion = () => (
  <Accordion type="single" collapsible defaultValue="me">
    {accordionData.map(({ id, title, content }) => (
      <AccordionItem key={id} value={id}>
        <AccordionTrigger className="min-h-11 font-display text-3xl uppercase tracking-wide">
          {title}
        </AccordionTrigger>
        <AccordionContent className="font-body text-xl leading-relaxed text-muted-foreground">
          <p>{content}</p>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
)
