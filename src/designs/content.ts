import portfolio1 from '@/assets/images/portfolio1.webp'
import portfolio2 from '@/assets/images/portfolio2.webp'
import portfolio3 from '@/assets/images/portfolio3.webp'
import portfolio4 from '@/assets/images/portfolio4.webp'
import portfolio5 from '@/assets/images/portfolio5.webp'
import portfolio6 from '@/assets/images/portfolio6.webp'
import portfolio7 from '@/assets/images/portfolio7.webp'
import portfolio8 from '@/assets/images/portfolio8.webp'
import workingPhoto from '@/assets/images/about_me_working.webp'
import { accordionData } from '@/common/constants'

export const artworks = [
  { id: 1, src: portfolio1, alt: 'Black and grey gorilla, mountain and horseback riders tattoo', width: 1125, height: 2000 },
  { id: 2, src: portfolio2, alt: 'Color sunflower and ladybird tattoo with geometric details', width: 1054, height: 2046 },
  { id: 3, src: portfolio3, alt: 'Color horror character collage tattoo', width: 1125, height: 1401 },
  { id: 4, src: portfolio4, alt: 'Portrait tattoo of a woman wearing a feather headdress', width: 1536, height: 2048 },
  { id: 5, src: portfolio5, alt: 'Black and grey skull soldier tattoo with helmet and respirator', width: 833, height: 1600 },
  { id: 6, src: portfolio6, alt: 'Color mythological portrait and three-headed dog tattoo surrounded by flames', width: 953, height: 1600 },
  { id: 7, src: portfolio7, alt: 'Detailed owl eye tattoo on the back of a hand', width: 1078, height: 1379 },
  { id: 8, src: portfolio8, alt: 'Black and grey sailing ship, octopus and woman portrait tattoo', width: 821, height: 1600 }
] as const

export const artistImage = workingPhoto
const originalBiography = accordionData.find(item => item.id === 'me')?.content
const originalPhilosophy = accordionData.find(item => item.id === 'philosophy')?.content
if (!originalBiography || !originalPhilosophy) throw new Error('Original artist content is missing')
export const biography = originalBiography
export const philosophy = originalPhilosophy
export const address = '9117 Little Rd, New Port Richey, FL 34654'

export const bookingChecklist = [
  'A short description of your idea',
  'Desired size and placement',
  'Days of the week or specific dates that work for you',
  'Budget'
] as const

export const contactChannels = [
  { label: 'Instagram', value: '@vicentart', href: 'https://www.instagram.com/vicentart/' },
  { label: 'Facebook', value: 'vicentartattoo', href: 'https://www.facebook.com/vicentartattoo/' },
  { label: 'Email', value: 'vicentartattoo@gmail.com', href: 'mailto:vicentartattoo@gmail.com' },
  { label: 'WhatsApp', value: '813-696-1137', href: 'https://wa.me/18136961137' }
] as const
