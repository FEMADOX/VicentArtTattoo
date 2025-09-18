const NavigationBar = () => (
  <nav className="z-20">
    <ul className="bg-black mb-10 text-white font-bold fixed top-0 left-0 w-full py-2 text-md">
      <li className="inline-block mx-4 hover:underline cursor-pointer">
        <a className="font-['Roboto']" href='#home'>
          HOME
        </a>
      </li>
      <li className="inline-block mx-4 hover:underline cursor-pointer">
        <a className="font-['Roboto']" href='#portfolio'>
          PORTFOLIO
        </a>
      </li>
      <li className="inline-block mx-4 hover:underline cursor-pointer">
        <a className="font-['Roboto']" href='#contact'>
          CONTACT
        </a>
      </li>
      <li className="inline-block mx-4 hover:underline cursor-pointer">
        <a className="font-['Roboto']" href='#about'>
          ABOUT
        </a>
      </li>
    </ul>
  </nav>
)

export default NavigationBar
