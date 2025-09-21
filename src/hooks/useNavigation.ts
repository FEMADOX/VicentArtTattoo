import { useEffect, useRef, useState } from 'react'
import { navigation } from '@/common'

export const useNavigation = () => {
  const [isActive, setIsActive] = useState(-1)
  const [currentSection, setCurrentSection] = useState('')
  const tabsRef = useRef<HTMLAnchorElement[]>([])

  // Handle active tab styling
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

  // Intersection Observer for scroll-based navigation
  useEffect(() => {
    const sections = navigation
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean) as HTMLElement[]

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          const sectionHash = `#${sectionId}`

          // Update URL hash without triggering navigation
          if (window.location.hash !== sectionHash) {
            window.history.replaceState(null, '', sectionHash)
            setCurrentSection(sectionId)

            // Update active tab
            const activeIndex = navigation.findIndex(({ href }) => href === sectionHash)
            if (activeIndex !== -1) setIsActive(activeIndex)
          }
        }
      })
    }, observerOptions)

    // Observe all sections
    sections.forEach(section => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // Handle hash changes on mount and route changes
  useEffect(() => {
    const updateActiveTab = () => {
      if (location.hash) {
        const hash = location.hash.replace('#', '')
        navigation.forEach(({ href }, index) => {
          const tab = tabsRef.current[index]
          if (!tab) return
          if (href === `#${hash}`) {
            setIsActive(index)
            setCurrentSection(hash)
          } else {
            tab.classList.remove('tab-active')
          }
        })
      } else {
        // If no hash, set home as active by default
        setIsActive(0)
        setCurrentSection('home')
      }
    }

    updateActiveTab()
    window.addEventListener('hashchange', updateActiveTab)

    return () => window.removeEventListener('hashchange', updateActiveTab)
  }, [])

  return {
    isActive,
    currentSection,
    tabsRef,
    setIsActive,
    setCurrentSection
  }
}
