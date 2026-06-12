import { CalendarDay } from './CalendarDay'
import { getDayShortName, getMonthName } from '../../utils/dateUtils'
import { flexCenter, flexColCenter } from '../../utils/tailwindHelpers'

/**
 * MonthView - Vue d'un mois unique
 */
export const MonthView = ({
  month,
  year,
  selectedDate,
  specialDays = [],
  onDateClick = () => {}
}) => {
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfMonth(month, year)
  const previousMonthDays = getDaysInMonth(month - 1, year)
  
  // Créer un array avec les jours du mois précédent, du mois actuel et du mois suivant
  const days = []
  
  // Jours du mois précédent
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, previousMonthDays - i),
      isCurrentMonth: false
    })
  }
  
  // Jours du mois actuel
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    })
  }
  
  // Jours du mois suivant
  const remainingDays = 42 - days.length // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    })
  }

  const hasEvent = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return specialDays.some(day => day.date === dateString)
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="bg-white p-3 md:p-4 border border-neutral-light-gray">
      {/* Month Header */}
      <h3 className="text-center font-bold text-sm md:text-base mb-3 md:mb-4 text-neutral-dark">
        {getMonthName(month)} {year}
      </h3>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className={`${flexCenter} h-7 md:h-8 text-xs md:text-sm font-bold text-neutral-dark-gray`}>
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className={flexCenter}>
            <CalendarDay
              date={day.date}
              isToday={isToday(day.date)}
              isSelected={isSelected(day.date)}
              hasEvent={hasEvent(day.date)}
              isCurrentMonth={day.isCurrentMonth}
              onClick={onDateClick}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
