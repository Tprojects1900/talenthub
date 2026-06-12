/**
 * Container - Conteneur wrapper avec largeur max
 */
export const Container = ({
  children,
  className = '',
  size = 'default'
}) => {
  const sizeClasses = {
    small: 'max-w-3xl',
    default: 'max-w-6xl',
    large: 'max-w-7xl',
    full: 'w-full'
  }

  return (
    <div className={`w-full mx-auto px-4 md:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Section - Composant section avec padding et container
 */
export const Section = ({
  children,
  className = '',
  padded = true,
  backgroundColor = 'bg-white'
}) => {
  const paddingClass = padded ? 'py-8 md:py-12 lg:py-16' : ''

  return (
    <section className={`w-full ${backgroundColor} ${paddingClass} ${className}`}>
      <Container>
        {children}
      </Container>
    </section>
  )
}
