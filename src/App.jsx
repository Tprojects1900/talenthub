import React, { useState } from 'react'
import { SwitchProvider } from './context/SwitchContext'
import AppRoutes from './routes'
export default function App() {
 

  return (
   <SwitchProvider>
     <AppRoutes/>
     </SwitchProvider>
  
  )
}
