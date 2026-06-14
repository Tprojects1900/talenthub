import React, { useState } from 'react'
import { SwitchProvider } from './context/SwitchContext'
import AppRoutes from './routes'
import { ScreenProvider } from './context/ScreenContext'
export default function App() {


  return (
    <ScreenProvider>
      <SwitchProvider>
        <AppRoutes />
      </SwitchProvider>
    </ScreenProvider>

  )
}
