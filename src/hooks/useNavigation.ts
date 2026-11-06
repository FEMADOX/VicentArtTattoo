import { useEffect, useState } from 'react'
import { navigation } from '@/common'

export const useNavigation = () => {
  const [currentSection, setCurrentSection] = useState('home')

  useEffect(() => {
    const updateFromHash = () => {
      const section = navigation.find(({ href }) => href === window.location.hash)
      setCurrentSection(section ? section.href.slice(1) : 'home')
    }
    updateFromHash()
    window.addEventListener('hashchange', updateFromHash)

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrentSection(entry.target.id)
      }
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 })

    for (const { href } of navigation) {
      const section = document.querySelector(href)
      if (section) observer.observe(section)
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', updateFromHash)
    }
  }, [])

  return { currentSection }
}
