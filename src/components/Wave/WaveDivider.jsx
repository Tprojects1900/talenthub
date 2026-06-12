/**
 * WaveDivider - Composant SVG Wave réutilisable
 * Crée un séparateur visuel avec vague colorée
 */

export const WaveDivider = ({
  color = '#A8D5BA',
  height = 40,
  opacity = 0.8,
  animate = true,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden ${className}`} style={{ height: `${height}px` }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ minHeight: '100%' }}
      >
        <path
          d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity={opacity}
          className={animate ? 'animate-pulse' : ''}
        />
      </svg>
    </div>
  )
}

/**
 * WaveDividerSoft - Version plus douce avec gradient
 */
export const WaveDividerSoft = ({
  color1 = '#A8D5BA',
  color2 = '#D4E8DC',
  height = 30,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden relative ${className}`} style={{ height: `${height}px` }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ minHeight: '100%' }}
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
          fill="url(#waveGradient)"
        />
      </svg>
    </div>
  )
}

/**
 * WaveDividerBottom - Vague en bas du composant
 */
export const WaveDividerBottom = ({
  color = '#A8D5BA',
  height = 25,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden -mt-1 ${className}`} style={{ height: `${height}px` }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ minHeight: '100%', transform: 'scaleY(-1)' }}
      >
        <path
          d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z"
          fill={color}
          fillOpacity="0.7"
        />
      </svg>
    </div>
  )
}
