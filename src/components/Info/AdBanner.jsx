import { flexCenter } from '../../utils/tailwindHelpers'

/**
 * AdBanner - Espace publicitaire placeholder
 */
export const AdBanner = ({ variant = 'standard' }) => {
  const sizes = {
    leaderboard: 'w-full h-24 md:h-32',
    rectangle: 'w-full h-72 md:h-80',
    standard: 'w-full h-24 md:h-28'
  }

  return (
    <div className={`${sizes[variant]} ${flexCenter} bg-neutral-light-gray border border-dashed border-neutral-gray rounded-none overflow-hidden`}>
      <div className="text-center">
        <p className="text-neutral-dark-gray font-semibold text-sm md:text-base mb-1">
          Espace Publicitaire
        </p>
        <p className="text-xs md:text-sm text-neutral-gray">
          AdSense - Support TOP FOOT
        </p>
      </div>
    </div>
  )
}
