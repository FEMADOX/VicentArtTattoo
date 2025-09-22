import { accordionData } from '@/common'
import { useAccordion } from '@/hooks'
import { getItemClasses } from '@/utils/accordionUtils'

export const AboutAccordion = () => {
  const { toggleSection, isOpen } = useAccordion()

  return (
    <div className="join join-vertical">
      {accordionData.map(({ id, title, content }, index) => (
        <div key={id} className={getItemClasses(index, isOpen(id), accordionData.length)}>
          <input
            type="checkbox"
            checked={isOpen(id)}
            defaultChecked={index === 0}
            onChange={() => toggleSection(id)}
            className="cursor-pointer"
          />
          <div className="collapse-title font-semibold text-4xl font-cinzel">{title}</div>
          <div className="collapse-content text-md xl:text-xl">
            <p>{content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
