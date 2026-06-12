import { useState, useEffect } from 'react'
import eventsData from '../data/events.json'

export const useEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un chargement asynchrone
    setTimeout(() => {
      setEvents(eventsData.events || [])
      setLoading(false)
    }, 100)
  }, [])

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }

  const getEventById = (id) => {
    return events.find(event => event.id === id)
  }

  const getAllMatches = () => {
    return events.filter(event => event.type === 'match')
  }

  const getAllDrawings = () => {
    return events.filter(event => event.type === 'drawing')
  }

  const getAllMeetings = () => {
    return events.filter(event => event.type === 'meeting')
  }

  const addEvent = (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: `event_${Date.now()}`
    }
    setEvents([...events, eventWithId])
    return eventWithId
  }

  const editEvent = (id, updatedEvent) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, ...updatedEvent } : event
    ))
  }

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id))
  }

  return {
    events,
    loading,
    getEventsForDate,
    getEventById,
    getAllMatches,
    getAllDrawings,
    getAllMeetings,
    addEvent,
    editEvent,
    deleteEvent
  }
}
