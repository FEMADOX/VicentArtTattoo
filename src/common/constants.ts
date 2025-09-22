import type { AccordionData, Navigation } from '@/common/types.ts'

export const navigation: Navigation = [
  { name: 'Home', href: '#home' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Contact', href: '#contact' },
  { name: 'About', href: '#about' }
]

export const accordionData: AccordionData[] = [
  {
    id: 'me',
    title: 'Me',
    content: `Vicent has been honing his craft for over 15 years, starting from a small studio in
    the heart of the city. His passion for art and ink is not just a profession but a
    calling. Specializing in black and grey and vibrant color tattoos,
    he transforms personal stories into breathtaking pieces of art. Each design is a
    collaboration, a shared journey between artist and client to create something truly
    unique and personal.`
  },
  {
    id: 'philosophy',
    title: 'My Philosophy',
    content: `At Vicentart, we believe that a tattoo is more than just an image on the skin; it's
    a piece of your soul made visible. Our philosophy is rooted in the belief that
    everyone has a story to tell, and our mission is to translate those stories into
    timeless art. We are committed to providing a safe, clean, and welcoming environment
    where creativity flows and clients feel comfortable expressing themselves. We use
    only the highest quality, vegan-friendly inks and state-of-the-art equipment to
    ensure your safety and the longevity of your tattoo.`
  }
]
