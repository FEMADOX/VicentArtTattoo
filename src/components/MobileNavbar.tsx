import { GiHamburgerMenu } from 'react-icons/gi'
import { IoClose } from 'react-icons/io5'
import { useEffect, useRef, useState } from 'react'
import { navigation } from '@/common'

export const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      )
        setIsOpen(false)
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="md:hidden flex">
      <div className="flex cursor-pointer">
        {/* Dropdown with icon swap */}
        <details className="dropdown" open={isOpen} ref={dropdownRef}>
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
    </div>
  )
}
