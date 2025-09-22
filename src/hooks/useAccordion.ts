import { useCallback, useState } from 'react'

export const useAccordion = () => {
  const [openSection, setOpenSection] = useState<string | null>('me')

  const toggleSection = useCallback((sectionId: string) => {
    setOpenSection(prevSection => (prevSection === sectionId ? null : sectionId))
  }, [])

  const isOpen = useCallback(
    (sectionId: string) => {
      return openSection === sectionId
    },
    [openSection]
  )

  return {
    openSection,
    toggleSection,
    isOpen
  }
}
