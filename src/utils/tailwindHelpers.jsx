/**
 * Utilitaires pour classes Tailwind réutilisables
 */

// Classes flexbox communes
export const flexCenter = 'flex items-center justify-center'
export const flexBetween = 'flex items-center justify-between'
export const flexStart = 'flex items-center justify-start'
export const flexEnd = 'flex items-center justify-end'
export const flexCol = 'flex flex-col'
export const flexColCenter = 'flex flex-col items-center justify-center'
export const flexColBetween = 'flex flex-col items-center justify-between'

// Grille commune
export const gridCols2 = 'grid grid-cols-1 md:grid-cols-2'
export const gridCols3 = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
export const gridCols4 = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

// Espacements
export const sectionPadding = 'px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10'
export const componentPadding = 'p-4 md:p-5 lg:p-6'
export const compactPadding = 'p-3 md:p-4'

// Gaps
export const gapSmall = 'gap-3'
export const gapMedium = 'gap-4 md:gap-5 lg:gap-6'
export const gapLarge = 'gap-6 md:gap-7 lg:gap-8'

// Bordures et ombres
export const cardShadow = 'shadow-base'
export const cardShadowHover = 'shadow-md hover:shadow-lg transition-shadow'
export const borderBottomOrange = 'border-b-4 border-brand-orange'

// Typo
export const heading1 = 'text-3xl md:text-4xl lg:text-5xl font-bold'
export const heading2 = 'text-2xl md:text-3xl lg:text-4xl font-bold'
export const heading3 = 'text-xl md:text-2xl lg:text-3xl font-bold'
export const heading4 = 'text-lg md:text-xl lg:text-2xl font-semibold'
export const bodyLarge = 'text-base md:text-lg leading-relaxed'
export const bodySmall = 'text-sm md:text-base'
export const caption = 'text-xs md:text-sm text-neutral-dark-gray'

// Buttons
export const buttonBase = 'px-4 py-2 font-medium transition-all duration-200 cursor-pointer'
export const buttonPrimary = `${buttonBase} bg-brand-orange text-white hover:bg-brand-orange-dark`
export const buttonSecondary = `${buttonBase} bg-brand-green text-white hover:bg-brand-green-dark`
export const buttonOutline = `${buttonBase} border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white`
export const buttonSmall = 'px-3 py-1 text-sm'

// Responsive visibility
export const mobileOnly = 'md:hidden'
export const desktopOnly = 'hidden md:block'
export const tabletOnly = 'hidden md:block lg:hidden'

// Background patterns
export const bgGradientOrangeGreen = 'bg-gradient-to-r from-brand-orange to-brand-green'
export const bgGradientGreenOrange = 'bg-gradient-to-r from-brand-green to-brand-orange'

// Cards génériques
export const cardContainer = `bg-white p-4 md:p-6 ${cardShadow} border-0`
export const cardContainerHover = `${cardContainer} hover:${cardShadowHover} transition-shadow`

// Alignement texte
export const textCenter = 'text-center'
export const textBalance = 'text-balance'

/**
 * Fonction utilitaire pour combiner les classes Tailwind
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Fonction pour convertir les couleurs de couleurs personnalisées
 */
export const getColorClass = (colorName) => {
  const colorMap = {
    orange: 'bg-brand-orange',
    green: 'bg-brand-green',
    'green-soft': 'bg-brand-green-soft',
    white: 'bg-white',
    'gray-light': 'bg-neutral-off-white',
  }
  return colorMap[colorName] || 'bg-white'
}

/**
 * Classes texte par type d'événement
 */
export const getEventTypeClass = (type) => {
  const typeMap = {
    match: 'text-brand-orange font-bold',
    drawing: 'text-brand-green font-semibold',
    meeting: 'text-neutral-dark font-semibold',
  }
  return typeMap[type] || 'text-neutral-dark'
}

/**
 * Classes pour les statuts
 */
export const getStatusClass = (status) => {
  const statusMap = {
    scheduled: 'bg-brand-green-softer text-brand-green-dark',
    live: 'bg-brand-orange text-white animate-pulse',
    finished: 'bg-neutral-light-gray text-neutral-dark-gray',
    upcoming: 'bg-neutral-off-white text-neutral-dark',
  }
  return statusMap[status] || 'bg-neutral-off-white'
}
