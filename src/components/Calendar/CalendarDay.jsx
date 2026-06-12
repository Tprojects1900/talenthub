/**
 * CalendarDay - Jour unique dans le calendrier
 */
export const CalendarDay = ({
  date,
  isToday = false,
  isSelected = false,
  hasEvent = false,
  isCurrentMonth = true,
  onClick = () => {}
}) => {
  const dayNum = date.getDate()
  
  const baseClasses = 'w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs md:text-sm font-medium rounded-none transition-all cursor-pointer'
  
  let dayClasses = baseClasses
  
  if (isToday) {
    dayClasses += ' bg-brand-orange text-white font-bold'
  } else if (isSelected) {
    dayClasses += ' bg-brand-green-soft text-neutral-dark border-2 border-brand-green'
  } else if (hasEvent) {
    dayClasses += ' text-brand-orange font-bold'
  } else if (!isCurrentMonth) {
    dayClasses += ' text-neutral-gray bg-neutral-off-white'
  } else {
    dayClasses += ' text-neutral-dark hover:bg-neutral-off-white'
  }

  return (
    <button
      onClick={() => onClick(date)}
      className={dayClasses}
      title={date.toLocaleDateString('fr-FR')}
    >
      {dayNum}
      {hasEvent && (
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-brand-green rounded-full"></div>
      )}
    </button>
  )
}
