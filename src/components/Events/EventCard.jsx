import { MatchCard } from './MatchCard'
import { DrawingCard } from './DrawingCard'
import { MeetingCard } from './MeetingCard'

/**
 * EventCard - Composant générique pour afficher un événement basé sur son type
 */
export const EventCard = ({ event, onViewDetails = () => {} }) => {
  if (!event) return null

  switch (event.type) {
    case 'match':
      return <MatchCard event={event} onViewDetails={onViewDetails} />
    case 'drawing':
      return <DrawingCard event={event} onViewDetails={onViewDetails} />
    case 'meeting':
      return <MeetingCard event={event} onViewDetails={onViewDetails} />
    default:
      return null
  }
}
