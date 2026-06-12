import React, { createContext, useState, useEffect } from 'react'
import eventsData from '../data/events.json'

export const EventContext = createContext()

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger les événements
    setTimeout(() => {
      setEvents(eventsData.events || [])
      setLoading(false)
    }, 100)
  }, [])

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }

  const value = {
    events,
    setEvents,
    selectedDate,
    setSelectedDate,
    getEventsForDate,
    loading
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}
