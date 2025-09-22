import { about_me_working } from '@/assets/images'
import { AboutAccordion } from '@/components/AboutAccordion.tsx'

export const AboutSection = () => (
  <section id="about" className="my-10">
    <div className="bg-black min-w-dvw px-5 py-10">
      <h2 className="text-4xl mb-10 font-bold font-cinzel">About Me</h2>
      <div className="grid grid-cols-1 gap-5 pb-10 items-center md:grid-cols-2 md:items-stretch">
        <div className="max-w-dvw ml-auto rounded-xl">
          <img className="rounded-xl" src={about_me_working} alt="Vicent working on a tattoo" />
        </div>
        <div className="max-w-150 text-left flex flex-col gap-8 text-lg text-gray-300 leading-relaxed mr-auto sm:text-sm md:text-lg">
          <AboutAccordion />
        </div>
      </div>
    </div>
  </section>
)
