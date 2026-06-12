import { useState, useEffect } from 'react'
import calendarData from '../data/calendar.json'

export const useCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [specialDays, setSpecialDays] = useState([])

  useEffect(() => {
    setSpecialDays(calendarData.specialDays || [])
  }, [])

  const isSpecialDay = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return specialDays.find(day => day.date === dateString)
  }

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(today)
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelectedDate = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    currentYear,
    specialDays,
    isSpecialDay,
    getDaysInMonth,
    getFirstDayOfMonth,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    isToday,
    isSelectedDate
  }
}
