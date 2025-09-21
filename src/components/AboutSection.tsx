import { about_me_working } from '@/assets/images'

export const AboutSection = () => (
  <section id="about" className="z-10 my-10">
    <div className="bg-black min-w-dvw p-5">
      <h2 className="text-4xl mb-10 font-bold">About Me</h2>
      <div className="flex items-center justify-between pb-10 gap-5">
        <div className="max-w-dvw ml-auto rounded-xl">
          <img className="rounded-xl" src={about_me_working} alt="Vicent working on a tattoo" />
        </div>
        <aside className="max-w-150 text-left flex flex-col gap-8 pl-5 text-lg text-gray-300 leading-relaxed mr-auto sm:text-sm md:text-lg">
          <div>
            <h4 className="text-4xl font-['Cinzel'] mb-3">Me</h4>
            <p>
              Vicent has been honing his craft for over 15 years, starting from a small studio in
              the heart of the city. His passion for art and ink is not just a profession but a
              calling. Specializing in hyper-realistic black and grey and vibrant color tattoos, he
              transforms personal stories into breathtaking pieces of art. Each design is a
              collaboration, a shared journey between artist and client to create something truly
              unique and personal.
            </p>
          </div>
          <div>
            <h4 className="text-4xl font-['Cinzel'] mb-3">My Philosophy</h4>
            <p>
              At Vicentart, we believe that a tattoo is more than just an image on the skin; it's a
              piece of your soul made visible. Our philosophy is rooted in the belief that everyone
              has a story to tell, and our mission is to translate those stories into timeless art.
              We are committed to providing a safe, clean, and welcoming environment where
              creativity flows and clients feel comfortable expressing themselves. We use only the
              highest quality, vegan-friendly inks and state-of-the-art equipment to ensure your
              safety and the longevity of your tattoo.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </section>
)
