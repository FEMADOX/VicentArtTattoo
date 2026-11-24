import workingPhoto from '@/assets/images/about_me_working.webp'
import { accordionData } from '@/common/constants'

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
