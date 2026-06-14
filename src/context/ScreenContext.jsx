import { createContext, useContext, useEffect, useState } from 'react'

const ScreenContext = createContext(null)

export const ScreenProvider = ({ children }) => {
  const [screenType, setScreenType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })

  const updateScreenType = () => {
    const width = window.innerWidth

    setScreenType({
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    })
  }

  useEffect(() => {
    updateScreenType()

    window.addEventListener('resize', updateScreenType)

    return () => {
      window.removeEventListener('resize', updateScreenType)
    }
  }, [])

  return (
    <ScreenContext.Provider value={screenType}>
      {children}
    </ScreenContext.Provider>
  )
}

export const useScreen = () => {
  const context = useContext(ScreenContext)

  if (!context) {
    throw new Error('useScreen must be used within a ScreenProvider')
  }

  return context
}