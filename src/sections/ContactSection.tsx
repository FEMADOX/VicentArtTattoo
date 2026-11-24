import * as motion from 'motion/react-m'
import { ArrowRight, ExternalLink, Camera, UserRound, Mail, MapPin, MessageCircle } from 'lucide-react'
import cn from '@/lib/utils'
import { useSiteMotion } from '@/motion/useSiteMotion'
import siteStyles from '@/styles/site'
import { address, contactChannels } from '@/content/site'

const channelIcons = { Instagram: Camera, Facebook: UserRound, Email: Mail, WhatsApp: MessageCircle }

const ContactSection = () => {
  const { reveal, hover } = useSiteMotion()

  return (
    <section id="contact" className={siteStyles.section} aria-labelledby="contact-heading">
      <div className={siteStyles.container}>
        <motion.header {...reveal()} className={siteStyles.sectionIntro}>
          <h2 id="contact-heading" className={siteStyles.heading}>Contact the artist</h2>
          <p className={siteStyles.copy}>Choose how you would like to get in touch. I mostly work by appointment.</p>
        </motion.header>
        <div className="mb-8 [@media(width<=720px)]:mb-6">
          <div className={siteStyles.policy}><strong>Appointment policy</strong><p>A deposit confirms your appointment and is applied to your total price. Deposits are non-refundable; a second deposit is required to change your appointment day.</p><a className={cn(siteStyles.textLink, 'mt-2')} href="#process">Review the full studio process <ArrowRight size={16} aria-hidden="true" /></a></div>
        </div>
        <div className="grid grid-cols-2 items-start gap-12 [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-8">
          <div className="grid gap-3">
            {contactChannels.map((channel, index) => {
              const Icon = channelIcons[channel.label]
              return <motion.a {...reveal(index * 0.07)} {...hover} key={channel.label} className="flex min-w-0 items-center gap-5 rounded-none border border-(--design-border) bg-surface p-5 text-foreground hover:border-input hover:bg-card [&>span]:min-w-0 [&>span]:flex-1 [&_strong]:block [&_strong]:text-base [&_strong]:font-normal [&>span>span]:mt-1 [&>span>span]:block [&>span>span]:text-sm [&>span>span]:text-(--design-muted) [&>span>span]:wrap-anywhere [@media(width<=720px)]:gap-3 [@media(width<=720px)]:p-4" href={channel.href}><Icon aria-hidden="true" size={24} /><span><strong>{channel.label}</strong><span>{channel.value}</span></span><ExternalLink size={18} aria-hidden="true" /></motion.a>
            })}
          </div>
          <motion.div {...reveal(0.12)} className="flex flex-col items-start gap-4 rounded-none border border-(--design-border) bg-surface p-9 [&_h3]:text-2xl/[1.2] [&_:is(address,p)]:text-base [&_:is(address,p)]:text-(--design-muted) [@media(width<=1000px)]:p-6"><MapPin size={28} aria-hidden="true" /><h3>New Port Richey</h3><address>{address}</address><p>Contact Vicent directly to discuss your idea and appointment.</p></motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
