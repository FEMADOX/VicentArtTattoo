import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoClose } from 'react-icons/io5'

type Navigation = Array<{ name: string; href: string }>

const navigation: Navigation = [
  { name: 'Home', href: '#home' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' }
]

export const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex sm:hidden cursor-pointer">
        {/* Dropdown with icon swap */}
        <details className="dropdown" open={isOpen}>
          <summary className="ml-6 list-none">
            <label className="swap swap-rotate">
              {/* this hidden checkbox controls the state */}
              <input
                className="hidden"
                checked={isOpen}
                type="checkbox"
                onChange={e => setIsOpen(e.target.checked)}
              />

              {/* hamburger icon */}
              <GiHamburgerMenu className="swap-off fill-current text-2xl" />

              {/* close icon */}
              <IoClose className="swap-on fill-current text-2xl" />
            </label>
          </summary>
          {/* Dropdown menu */}
          <ul className="menu dropdown-content bg-base-100 z-1 mt-3 w-full shadow text-xl pb-4 cursor-default">
            {navigation.map(item => (
              <li className="content-center" key={item.name}>
                <a onClick={() => setIsOpen(false)} href={item.href}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
      <div className="font-['Cinzel'] text-xl flex-1">VicentArt</div>
      <div className="flex-none sm:hidden">
        <div className="btn btn-square btn-ghost cursor-default"></div>
      </div>
    </div>
  )
}
