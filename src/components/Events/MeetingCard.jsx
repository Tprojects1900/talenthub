import { Users, Clock, MapPin } from 'lucide-react'
import { formatDateTime } from '../../utils/dateUtils'
import { flexCenter, cardShadow } from '../../utils/tailwindHelpers'

/**
 * MeetingCard - Affiche une réunion
 */
export const MeetingCard = ({ event, onViewDetails = () => {} }) => {
  return (
    <div className={`bg-white p-4 md:p-6 ${cardShadow} border-l-4 border-neutral-dark overflow-hidden`}>
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users size={20} className="text-neutral-dark" />
          <h3 className="text-lg md:text-xl font-bold text-neutral-dark">
            {event.title}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-neutral-dark-gray">
          {formatDateTime(event.date, event.time)}
        </p>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-xs md:text-sm text-neutral-dark mb-4">
          {event.description}
        </p>
      )}

      {/* Location */}
      <div className={`${flexCenter} gap-2 mb-4 text-xs md:text-sm text-neutral-dark-gray`}>
        <MapPin size={16} />
        <span>{event.location}</span>
      </div>

      {/* Icon visual */}
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 bg-neutral-off-white flex items-center justify-center text-neutral-dark rounded-none">
          <Users size={32} />
        </div>
      </div>

      {/* Info Badge */}
      <div className="mb-4 px-3 py-2 bg-neutral-off-white text-neutral-dark text-xs md:text-sm rounded-none text-center font-semibold">
        Présence obligatoire
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(event)}
        className="w-full px-4 py-2 md:py-3 bg-neutral-dark text-white text-sm md:text-base font-semibold hover:bg-neutral-dark-gray transition-colors duration-200 rounded-none"
      >
        Plus de détails
      </button>
    </div>
  )
}
