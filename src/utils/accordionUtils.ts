export const getItemClasses = (index: number, isOpen: boolean, totalLength: number) => {
  const baseClasses = 'collapse collapse-arrow join-item border-base-300 border overflow-hidden'
  const roundedTop = index === 0 ? 'rounded-t-xl' : ''
  const roundedBottom = index === totalLength - 1 ? 'rounded-b-xl' : ''
  const openState = isOpen ? 'collapse-open' : 'collapse-close'

  return `${baseClasses} ${roundedTop} ${roundedBottom} ${openState}`.trim()
}
