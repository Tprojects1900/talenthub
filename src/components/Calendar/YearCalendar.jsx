import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MonthView } from './MonthView'
import { Container, Section } from '../Layout/Container'
import { flexBetween } from '../../utils/tailwindHelpers'

/**
 * YearCalendar - Calendrier annuel avec scroll horizontal
 */
export const YearCalendar = ({
  year = new Date().getFullYear(),
  selectedDate,
  specialDays = [],
  onDateClick = () => {},
  className = ''
}) => {
  const scrollContainer = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const handleScroll = () => {
    if (!scrollContainer.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction) => {
    if (!scrollContainer.current) return
    
    const scrollAmount = 300
    scrollContainer.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <Section className={className}>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-2 text-balance">
          Calendrier {year}
        </h2>
        <p className="text-sm md:text-base text-neutral-dark-gray">
          Sélectionnez une date pour voir les événements
        </p>
      </div>

      {/* Scroll Container with Navigation */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-none shadow-md hover:shadow-lg transition-shadow hidden md:flex items-center justify-center text-brand-orange"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Calendar Container */}
        <div
          ref={scrollContainer}
          onScroll={handleScroll}
          className="overflow-x-auto pb-4 px-0 md:px-8 scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="flex gap-3 md:gap-4 min-w-max">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full sm:w-96 md:w-80"
                style={{ minWidth: '300px' }}
              >
                <MonthView
                  month={i}
                  year={year}
                  selectedDate={selectedDate}
                  specialDays={specialDays}
                  onDateClick={onDateClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-none shadow-md hover:shadow-lg transition-shadow hidden md:flex items-center justify-center text-brand-orange"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 text-xs md:text-sm text-neutral-dark-gray">
        <span className="inline-flex items-center gap-2 mr-4">
          <span className="w-2 h-2 bg-brand-orange rounded-full"></span>
          Date d&apos;aujourd&apos;hui
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-brand-green rounded-full"></span>
          Jour avec événement(s)
        </span>
      </div>
    </Section>
  )
}
