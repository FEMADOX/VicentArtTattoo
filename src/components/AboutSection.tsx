import { about_me_working } from '@/assets/images'
import { AboutAccordion } from '@/components/AboutAccordion'

export const AboutSection = () => (
  <section id="about" aria-labelledby="about-heading" className="scroll-mt-24 border-t border-border px-5 py-20 md:px-10 md:py-28">
    <div className="mx-auto max-w-7xl">
      <h2 id="about-heading" className="mb-10 font-display text-4xl uppercase tracking-wide md:text-5xl">About Me</h2>
      <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
        <img className="h-auto w-full" src={about_me_working} alt="Vicent working on a tattoo" loading="lazy" decoding="async" />
        <AboutAccordion />
      </div>
    </div>
  </section>
)
