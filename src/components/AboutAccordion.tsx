import { accordionData } from '@/common'
import { useState } from 'react'

export const AboutAccordion = () => {
  const [openSection, setOpenSection] = useState<string | null>('me')

  const handleSectionClick = (sectionId: string) => {
    if (openSection === sectionId) {
      setOpenSection(null)
    } else {
      setOpenSection(sectionId)
    }
  }

  return (
    <div className="join join-vertical">
      {accordionData.map(({ id, title, content }, index) => (
        <div
          key={id}
          className={`collapse collapse-arrow join-item border-base-300 border overflow-hidden ${
            index === 0 ? 'rounded-t-xl' : ''
          } ${index === accordionData.length - 1 ? 'rounded-b-xl' : ''} ${
            openSection === id ? 'collapse-open' : 'collapse-close'
          }`}
          defaultChecked={index === 0}
        >
          <input
            type="checkbox"
            checked={openSection === id}
            onChange={() => handleSectionClick(id)}
            className="peer cursor-pointer"
          />
          <div className="collapse-title font-semibold text-4xl font-cinzel">{title}</div>
          <div className="collapse-content text-md">
            <p>{content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
