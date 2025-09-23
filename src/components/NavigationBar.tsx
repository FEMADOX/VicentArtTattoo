import { navigation } from '@/common'
import { MobileNavbar } from '@/components/MobileNavbar.tsx'
import { useNavigation } from '@/hooks/useNavigation'
import { FaGithub } from 'react-icons/fa'

export const NavigationBar = () => {
  const { tabsRef, setIsActive } = useNavigation()

  return (
    <nav className="navbar bg-base-100 shadow-sm justify-between">
      <MobileNavbar />
      <div className="hidden md:flex">
        <div role="tablist" className="tabs tabs-border">
          <ul className="flex">
            {navigation.map(({ name, href }, index) => (
              <li className="list-none" key={index}>
                <a
                  ref={el => {
                    tabsRef.current[index] = el!
                  }}
                  role="tab"
                  className="tab text-xl font-roboto uppercase"
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
      <div className="font-cinzel text-xl md:pr-5">VicentArt</div>
      <div className="px-5 hover:text-gray-300 cursor-pointer md:hidden">
        <a href="https://github.com/FEMADOX/VicentArtTattoo"></a>
        <FaGithub />
      </div>
    </nav>
  )
}
