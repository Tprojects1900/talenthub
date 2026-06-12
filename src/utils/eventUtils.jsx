export const sortEventsByDate = (events) => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + (a.time || '00:00'))
    const dateB = new Date(b.date + ' ' + (b.time || '00:00'))
    return dateA - dateB
  })
}

export const filterEventsByType = (events, type) => {
  return events.filter(event => event.type === type)
}

export const filterEventsByDate = (events, date) => {
  const dateString = date.toISOString().split('T')[0]
  return events.filter(event => event.date === dateString)
}

export const filterEventsByMonth = (events, month, year) => {
  return events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === month && eventDate.getFullYear() === year
  })
}

export const getEventStatus = (event) => {
  const eventDate = new Date(event.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)

  if (eventDate < today) return 'past'
  if (eventDate.getTime() === today.getTime()) return 'today'
  return 'upcoming'
}

export const getEventIcon = (type) => {
  const icons = {
    match: 'Zap',
    drawing: 'Shuffle',
    meeting: 'Users'
  }
  return icons[type] || 'Calendar'
}

export const getEventColor = (type) => {
  const colors = {
    match: '#FF8C00',
    drawing: '#4CAF50',
    meeting: '#333333'
  }
  return colors[type]
}

export const formatEventType = (type) => {
  const types = {
    match: 'Match',
    drawing: 'Tirage',
    meeting: 'Réunion'
  }
  return types[type] || type
}
