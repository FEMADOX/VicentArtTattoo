import { useEffect, useState } from 'react'
import { navigation } from '@/common'
import { MobileNavbar } from '@/components/MobileNavbar.tsx'

export const NavigationBar = () => {
  const [isActive, setIsActive] = useState(-1)

  useEffect(() => {
    const tabs = document.querySelectorAll('.tab')

    if (isActive !== -1) {
      navigation.forEach((_item, index) => {
        const { [index]: tab } = tabs
        if (index === isActive) {
          tab.classList.add('tab-active')
        } else {
          tab.classList.remove('tab-active')
        }
      })
    }
  }, [isActive])

  return (
    <nav className="navbar bg-base-100 shadow-sm justify-between">
      <MobileNavbar />
      <div className="hidden md:flex">
        <div role="tablist" className="tabs tabs-border">
          <ul className="flex">
            {navigation.map(({ name, href }, index) => (
              <li className="list-none" key={index}>
                <a
                  key={index}
                  role="tab"
                  className="tab text-xl font-['Roboto'] uppercase"
                  href={href}
                  onClick={() => setIsActive(index)}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="font-cinzel text-xl md:pr-10">VicentArt</div>
      <div className="px-6 sm:hidden"></div>
    </nav>
  )
}
