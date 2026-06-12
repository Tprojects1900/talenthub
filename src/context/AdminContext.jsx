import React, { createContext, useState } from 'react'

export const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const value = {
    isAdmin,
    setIsAdmin,
    adminMode,
    setAdminMode,
    editingItem,
    setEditingItem
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}
