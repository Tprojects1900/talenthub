import { Clock, MapPin } from 'lucide-react'
import { formatDateTime } from '../../utils/dateUtils'
import { flexBetween, flexCenter, cardShadow } from '../../utils/tailwindHelpers'

/**
 * MatchCard - Affiche un match de football
 */
export const MatchCard = ({ event, onViewDetails = () => {} }) => {
  const isLive = event.status === 'live'
  const isFinished = event.status === 'finished'

  return (
    <div className={`bg-white p-4 md:p-6 ${cardShadow} border-l-4 border-brand-orange overflow-hidden`}>
      {/* Header */}
      <div className="mb-4">
        <div className={`${flexBetween}`}>
          <h3 className="text-lg md:text-xl font-bold text-neutral-dark">
            Match
          </h3>
          {isLive && (
            <div className="px-3 py-1 bg-brand-orange text-white text-xs md:text-sm font-bold animate-pulse rounded-none">
              EN DIRECT
            </div>
          )}
          {isFinished && (
            <div className="px-3 py-1 bg-neutral-light-gray text-neutral-dark-gray text-xs md:text-sm font-bold rounded-none">
              TERMINÉ
            </div>
          )}
        </div>
        <p className="text-xs md:text-sm text-neutral-dark-gray mt-1">
          {formatDateTime(event.date, event.time)}
        </p>
      </div>

      {/* Match Score */}
      <div className={`${flexBetween} mb-4 md:mb-6 gap-4`}>
        {/* Team 1 */}
        <div className="flex-1">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-none bg-brand-orange flex items-center justify-center text-white font-bold text-lg md:text-2xl">
              {event.team1.initials}
            </div>
            <p className="text-center text-xs md:text-sm font-semibold text-neutral-dark line-clamp-2">
              {event.team1.name}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <div className="text-2xl md:text-4xl font-bold text-brand-orange">
            {event.score ? `${event.score.team1}` : '—'}
          </div>
          <div className="text-xs text-neutral-dark-gray mt-1">vs</div>
          <div className="text-2xl md:text-4xl font-bold text-brand-orange">
            {event.score ? `${event.score.team2}` : '—'}
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex-1">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-none bg-brand-green flex items-center justify-center text-white font-bold text-lg md:text-2xl">
              {event.team2.initials}
            </div>
            <p className="text-center text-xs md:text-sm font-semibold text-neutral-dark line-clamp-2">
              {event.team2.name}
            </p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className={`${flexCenter} gap-2 mb-4 text-xs md:text-sm text-neutral-dark-gray`}>
        <MapPin size={16} />
        <span>{event.location}</span>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(event)}
        className="w-full px-4 py-2 md:py-3 bg-brand-orange text-white text-sm md:text-base font-semibold hover:bg-brand-orange-dark transition-colors duration-200 rounded-none"
      >
        Voir les détails
      </button>
    </div>
  )
}
