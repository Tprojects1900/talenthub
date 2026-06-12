import * as Icons from 'lucide-react'
import { WaveDividerBottom } from '../Wave/WaveDivider'
import { flexColCenter } from '../../utils/tailwindHelpers'

/**
 * InfoCard - Composant d'information dynamique avec wave divider
 */
export const InfoCard = ({
  title = '',
  description = '',
  icon = 'Trophy',
  variant = 'primary',
  actionText = '',
  actionUrl = '#',
  className = ''
}) => {
  // Résoudre l'icône Lucide
  const IconComponent = Icons[icon] || Icons.Trophy

  const variantStyles = {
    primary: {
      bg: 'bg-white',
      icon: 'text-brand-orange',
      titleColor: 'text-neutral-dark',
      wave: '#A8D5BA'
    },
    secondary: {
      bg: 'bg-neutral-off-white',
      icon: 'text-brand-green',
      titleColor: 'text-neutral-dark',
      wave: '#A8D5BA'
    }
  }

  const style = variantStyles[variant] || variantStyles.primary

  return (
    <div className={`${style.bg} overflow-hidden ${className}`}>
      <div className="p-5 md:p-6 lg:p-7">
        {/* Icon */}
        <div className="mb-3 md:mb-4">
          <IconComponent size={32} className={`${style.icon}`} />
        </div>

        {/* Title */}
        <h3 className={`${style.titleColor} text-lg md:text-xl font-bold mb-2 md:mb-3`}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-neutral-dark-gray leading-relaxed mb-4 md:mb-5">
          {description}
        </p>

        {/* Action Button */}
        {actionText && (
          <a
            href={actionUrl}
            className="inline-block px-4 py-2 bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors duration-200 rounded-none"
          >
            {actionText}
          </a>
        )}
      </div>

      {/* Wave Divider */}
      <WaveDividerBottom color={style.wave} height={15} />
    </div>
  )
}

/**
 * InfoSection - Grille de cartes InfoCard
 */
export const InfoSection = ({ infos = [], className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6 ${className}`}>
      {infos.map((info) => (
        <InfoCard
          key={info.id}
          title={info.title}
          description={info.description}
          icon={info.icon}
          variant={info.variant}
          actionText={info.actionText}
          actionUrl={info.actionUrl}
        />
      ))}
    </div>
  )
}
