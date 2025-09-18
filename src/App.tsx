import './App.css'
import { about_me_working, portfolio1, portfolio2, portfolio3, portfolio4 } from './assets/images'
import { NavigationBar, PortfolioCard } from './components'

function App() {
  return (
    <div className="relative bg-[url('/logo.svg')] bg-fixed bg-black min-h-screen min-w-dvw flex flex-col items-center justify-center text-center text-white">
      <NavigationBar />
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Home Section */}
      <section id="home" className="z-10 mt-20 mb-10 max-w-200">
        <div className="border-b-2 flex justify-center pb-4 mb-4">
          <img
            className="bg-white text-black rounded-full p-0.5 min-w-20 max-w-30 min-h-20 text-center mb-2"
            src="/logo.svg"
            alt="logo"
          />
        </div>
        <h1 className="mt-5 font-['Cinzel'] text-5xl font-bold">Vicentart</h1>
        <h2 className="mb-5 text-md font-['Roboto'] text-gray-300">TATTOO ARTIST</h2>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="max-w-lg">
            Location
            <br />
            9117 Little Rd, New Port Richey, FL 34654
            <br />ɪ ᴍᴏsᴛʟʏ ᴡᴏʀᴋ ʙʏ ᴀᴘᴘᴏɪɴᴛᴍᴇɴᴛ. You can contact me through my instagram, Facebook or
            send a message to 813-696-1137
          </p>
          <p className="max-w-lg">
            Design Process
            <br />ɪ ᴀʟᴡᴀʏs ᴛᴀᴋᴇ ᴍʏ ᴛɪᴍᴇ ᴀɴᴅ ᴇɴᴊᴏʏ ᴛʜᴇ ᴘʀᴏᴄᴇss ᴄʀᴇᴀᴛɪɴɢ ᴀn ᴜɴɪǫᴜᴇ ᴘɪᴇᴄᴇ ғᴏʀ ᴇᴀᴄʜ
            ᴄᴜsᴛᴏᴍᴇʀ, ᴇᴠᴇʀʏᴛʜɪɴɢ ɪs ᴅᴇsɪɢɴᴇᴅ ʙᴇғᴏʀᴇ ʏᴏᴜ ᴀʀʀɪᴠᴇ ᴛᴏ ʏᴏᴜʀ ᴀᴘᴘᴏɪɴᴛᴍᴇɴᴛ ᴀɴᴅ sʜᴏᴡɴ ᴛᴏ ʏᴏᴜ
            ᴏɴ ʏᴏᴜʀ ᴀᴘᴘᴏɪɴᴛᴍᴇɴᴛ ᴅᴀᴛᴇ.
          </p>
          <p className="max-w-lg">
            Deposit
            <br />ᴀ ᴅᴇᴘᴏsɪᴛ ɪs ᴀ ᴍᴜsᴛ. ᴛʜᴇ ᴅᴇᴘᴏsɪᴛ ᴡɪʟʟ ʙᴇ ɪɴᴄʟᴜᴅᴇᴅ ɪɴ ʏᴏᴜʀ ᴘʀᴏᴊᴇᴄᴛ ᴛᴏᴛᴀʟ ᴘʀɪᴄᴇ.
            ᴏɴᴄᴇ ᴛʜᴇ ᴅᴇᴘᴏsɪᴛ ɪs ʀᴇᴄᴇɪᴠᴇᴅ, ʏᴏᴜʀ ᴀᴘᴘᴏɪɴᴛᴍᴇɴᴛ ɪs ᴛʜᴇɴ ᴄᴏɴғɪʀᴍᴇᴅ. ɪ ᴍᴏsᴛʟʏ ᴜsᴇ Cash app,
            Zelle, Apple-pay, Venmo ᴀs ᴘᴀʏᴍᴇɴᴛ ᴍᴇᴛʜᴏᴅ. ʙᴜᴛ, ʏᴏᴜ ᴄᴀɴ sᴛᴏᴘ ʙʏ ᴛʜᴇ sʜᴏᴘ ᴀɴᴅ ᴘᴀʏ ɪɴ ᴄᴀsʜ
            ᴀs ᴡᴇʟʟ.
          </p>
          <p>How to book</p>
          <ul className="list-disc max-w-lg text-left">
            <li>A short description of your idea</li>
            <li>Desired size & placement</li>
            <li>Days of the week or specific dates that work for you</li>
            <li>Budget</li>
          </ul>
          <p>Rescheduling | Cancellations</p>
          <p className="text-center">
            Deposits are non-refundable and a second deposit will be required if you want to change
            your appointment day. Please be sure you can make it before booking.
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="z-10 my-10">
        <div className="bg-black min-w-dvw p-5">
          <h2 className="text-4xl mb-10 font-bold">Portfolio</h2>
          <div className="flex justify-center gap-4">
            <PortfolioCard image={portfolio1} />
            <PortfolioCard image={portfolio2} />
            <PortfolioCard image={portfolio3} />
            <PortfolioCard image={portfolio4} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="z-10 my-10">
        <h2 className="text-4xl mb-10 font-bold">Contact</h2>
        {/*<p>Please email to book: vicentartattoo@gmail.com</p>*/}
        <p>You can contact me through</p>
        <br />
        <ul className="max-w-lg text-left">
          <li>Instagram: @vicentart</li>
          <li>Facebook: vicentartattoo</li>
          <li>Email: vicentartattoo@gmail.com</li>
          <li>Whatsapp: 813-696-1137</li>
        </ul>
      </section>

      {/* About Me*/}
      <section id="about" className="z-10 my-10">
        <div className="bg-black min-w-dvw p-5">
          <h2 className="text-4xl mb-10 font-bold">About Me</h2>
          <div className="flex items-center justify-between pb-10">
            <div className="min-w-1/3 max-w-sm mx-auto rounded-md">
              <img className="roundede-md" src={about_me_working} alt="Vicent working on a tattoo" />
            </div>
            <aside className="max-w-150 text-left flex flex-col gap-8 pl-5 md:w-1/2 text-lg text-gray-300 leading-relaxed">
              <div>
                <h4 className="text-4xl font-['Cinzel'] mb-3">Me</h4>
                <p>
                  Vicent has been honing his craft for over 15 years, starting from a small studio
                  in the heart of the city. His passion for art and ink is not just a profession but
                  a calling. Specializing in hyper-realistic black and grey and vibrant color
                  tattoos, he transforms personal stories into breathtaking pieces of art. Each
                  design is a collaboration, a shared journey between artist and client to create
                  something truly unique and personal.
                </p>
              </div>
              <div>
                <h4 className="text-4xl font-['Cinzel'] mb-3">My Philosophy</h4>
                <p>
                  At Vicentart, we believe that a tattoo is more than just an image on the skin;
                  it's a piece of your soul made visible. Our philosophy is rooted in the belief
                  that everyone has a story to tell, and our mission is to translate those stories
                  into timeless art. We are committed to providing a safe, clean, and welcoming
                  environment where creativity flows and clients feel comfortable expressing
                  themselves. We use only the highest quality, vegan-friendly inks and
                  state-of-the-art equipment to ensure your safety and the longevity of your tattoo.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <footer>
        <p className="my-10">© 2024 Vicentart. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
