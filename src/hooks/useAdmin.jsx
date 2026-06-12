import { useState, useEffect } from 'react'

const ADMIN_PASSWORD = 'topfoot2026'
const ADMIN_KEY = 'topfoot_admin_auth'
const ADMIN_DATA_KEY = 'topfoot_admin_data'

export const useAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [adminData, setAdminData] = useState({
    events: [],
    info: []
  })

  useEffect(() => {
    // Vérifier si l'admin est déjà connecté
    const savedAuth = localStorage.getItem(ADMIN_KEY)
    if (savedAuth) {
      setIsAuthenticated(true)
      setAdminMode(true)
    }

    // Charger les données admin sauvegardées
    const savedData = localStorage.getItem(ADMIN_DATA_KEY)
    if (savedData) {
      try {
        setAdminData(JSON.parse(savedData))
      } catch (error) {
        console.error('Erreur chargement données admin:', error)
      }
    }
  }, [])

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, 'true')
      setIsAuthenticated(true)
      setAdminMode(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY)
    setIsAuthenticated(false)
    setAdminMode(false)
  }

  const updateAdminData = (newData) => {
    const updated = { ...adminData, ...newData }
    setAdminData(updated)
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(updated))
  }

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: `admin_${Date.now()}`
    }
    const updatedEvents = [...(adminData.events || []), newEvent]
    updateAdminData({ ...adminData, events: updatedEvents })
    return newEvent
  }

  const updateEvent = (id, updates) => {
    const updatedEvents = (adminData.events || []).map(event =>
      event.id === id ? { ...event, ...updates } : event
    )
    updateAdminData({ ...adminData, events: updatedEvents })
  }

  const deleteEvent = (id) => {
    const updatedEvents = (adminData.events || []).filter(event => event.id !== id)
    updateAdminData({ ...adminData, events: updatedEvents })
  }

  const updateInfo = (infoList) => {
    updateAdminData({ ...adminData, info: infoList })
  }

  const resetData = () => {
    localStorage.removeItem(ADMIN_DATA_KEY)
    setAdminData({ events: [], info: [] })
  }

  return {
    isAuthenticated,
    adminMode,
    adminData,
    login,
    logout,
    addEvent,
    updateEvent,
    deleteEvent,
    updateInfo,
    resetData
  }
}
