import { navigation } from '@/common'
import { MobileNavbar } from '@/components/MobileNavbar.tsx'
import { useNavigation } from '@/hooks/useNavigation'

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
