import * as motion from 'motion/react-m'
import { ArrowDownLeft } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { bookingChecklist } from '@/content/site'
import { useSiteMotion } from '@/motion/useSiteMotion'
import siteStyles from '@/styles/site'

const ProcessSection = () => {
  const { reveal } = useSiteMotion()

  return (
    <section id="process" className="border-y border-border bg-surface py-16 md:py-24 xl:py-30" aria-labelledby="process-heading">
      <div className={siteStyles.container}>
        <motion.header {...reveal()} className={siteStyles.sectionIntro}>
          <h2 id="process-heading" className={siteStyles.heading}>The studio process</h2>
          <p className={siteStyles.copy}>I mostly work by appointment. Here is what to prepare and what to expect before booking.</p>
        </motion.header>
        <ol className="mb-16 grid list-none grid-cols-3 gap-10 p-0 [&_li>span]:mb-6 [&_li>span]:block [&_li>span]:text-2xl/[1.6] [&_li>span]:text-muted-foreground [&_li>span]:font-display [&_h3]:mb-3 [&_h3]:text-xl [&_p]:text-base [&_p]:leading-[1.8] [&_p]:text-(--design-muted) [@media(width<=720px)]:mb-10 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8 [@media(width<=720px)]:[&_li>span]:mb-2">
          <motion.li {...reveal()}><span>01</span><h3>Share your idea</h3><p>Send a description of your tattoo, desired size and placement, dates that work for you, and budget.</p></motion.li>
          <motion.li {...reveal(0.09)}><span>02</span><h3>Confirm your appointment</h3><p>A deposit is required and is included in your total price. Your appointment is confirmed once the deposit is received.</p></motion.li>
          <motion.li {...reveal(0.18)}><span>03</span><h3>See your design</h3><p>Each piece is designed before you arrive and shown to you on your appointment date.</p></motion.li>
        </ol>
        <div className="grid grid-cols-2 items-start gap-12 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8">
          <motion.div {...reveal()} id="booking" className={siteStyles.panel}>
            <h3>Before you get in touch</h3>
            <p className={siteStyles.copy}>Include these details in your first message.</p>
            <ul className={siteStyles.checklist}>{bookingChecklist.map(item => <li key={item}><ArrowDownLeft aria-hidden="true" size={18} /><span>{item}</span></li>)}</ul>
          </motion.div>
          <div className="min-w-0">
            <h3 className="mb-4 text-2xl">Booking questions</h3>
            <Accordion type="multiple">
              <AccordionItem value="booking-1"><AccordionTrigger>When will I see my design?</AccordionTrigger><AccordionContent>Everything is designed before you arrive and shown to you on your appointment date.</AccordionContent></AccordionItem>
              <AccordionItem value="booking-2"><AccordionTrigger>How does the deposit work?</AccordionTrigger><AccordionContent>A deposit is required to confirm your appointment and is applied to the total price of your tattoo.</AccordionContent></AccordionItem>
              <AccordionItem value="booking-3"><AccordionTrigger>What if I need to change my appointment?</AccordionTrigger><AccordionContent>Deposits are non-refundable. A second deposit is required if you change your appointment day. Please be sure you can make it before booking.</AccordionContent></AccordionItem>
              <AccordionItem value="booking-4"><AccordionTrigger>Which payment methods are accepted?</AccordionTrigger><AccordionContent>Cash App, Zelle, Apple Pay and Venmo are used for payments. You can also stop by the shop and pay in cash.</AccordionContent></AccordionItem>
            </Accordion>
          </div>
        </div>
        <p className={`${siteStyles.policy} mt-10`}><strong>Before booking:</strong> Deposits are non-refundable. A second deposit is required to change your appointment day.</p>
      </div>
    </section>
  )
}

export default ProcessSection
