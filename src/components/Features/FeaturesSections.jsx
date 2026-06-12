import { Trophy, Award, Users, Heart, MapPin } from 'lucide-react'
import { flexColCenter, flexBetween } from '../../utils/tailwindHelpers'

/**
 * TournamentInfo - Informations générales du tournoi
 */
export const TournamentInfo = () => {
  return (
    <div className="bg-white p-6 md:p-8 border border-neutral-light-gray">
      <div className={`${flexColCenter} gap-4 md:gap-6`}>
        <Trophy size={48} className="text-brand-orange" />
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-2">
            TOP FOOT 2026
          </h3>
          <p className="text-sm md:text-base text-neutral-dark-gray">
            La 4ème édition du plus prestigieux tournoi de football du quartier Maya Kopé.
            Rassemblant plus de 500 jeunes passionnés, TOP FOOT est une célébration du football,
            de l'équipe-travail et de l'excellence sportive.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * PrizeSection - Section des prix et récompenses
 */
export const PrizeSection = () => {
  const prizes = [
    {
      position: '1er Place',
      prize: '500.000 FCFA + Trophée d\'or',
      icon: Trophy
    },
    {
      position: '2ème Place',
      prize: '300.000 FCFA + Trophée d\'argent',
      icon: Award
    },
    {
      position: '3ème Place',
      prize: '200.000 FCFA + Trophée de bronze',
      icon: Award
    }
  ]

  return (
    <div className="bg-neutral-off-white p-6 md:p-8">
      <h3 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-6 text-center">
        Prix et Récompenses
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {prizes.map((item, index) => {
          const IconComp = item.icon
          return (
            <div key={index} className="bg-white p-4 md:p-5 text-center border border-neutral-light-gray">
              <IconComp size={32} className="mx-auto mb-3 text-brand-orange" />
              <h4 className="text-lg md:text-xl font-bold text-neutral-dark mb-2">
                {item.position}
              </h4>
              <p className="text-sm md:text-base text-neutral-dark-gray">
                {item.prize}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * RegisterTeam - Appel à inscription
 */
export const RegisterTeam = () => {
  return (
    <div className="bg-brand-orange text-white p-6 md:p-8">
      <div className={`${flexColCenter} gap-4 md:gap-6 text-center`}>
        <Users size={48} />
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Inscrivez votre Équipe
          </h3>
          <p className="text-sm md:text-base mb-4 opacity-90">
            Les meilleures équipes du quartier vont s'affronter dans TOP FOOT 2026.
            Frais d'inscription: 50.000 FCFA
          </p>
          <button className="px-6 md:px-8 py-2 md:py-3 bg-white text-brand-orange font-bold text-base md:text-lg hover:bg-neutral-off-white transition-colors rounded-none">
            S'inscrire Maintenant
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * SupportTournament - Appel au soutien
 */
export const SupportTournament = () => {
  return (
    <div className="bg-white p-6 md:p-8 border border-neutral-light-gray">
      <div className={`${flexColCenter} gap-4 md:gap-6 text-center`}>
        <Heart size={48} className="text-brand-green" />
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-2">
            Soutenez le Tournoi
          </h3>
          <p className="text-sm md:text-base text-neutral-dark-gray mb-4">
            Devenir sponsor de TOP FOOT et aider à développer le football dans notre quartier.
            Ensemble, nous créons des opportunités pour les jeunes.
          </p>
          <button className="px-6 md:px-8 py-2 md:py-3 bg-brand-green text-white font-bold text-base md:text-lg hover:bg-brand-green-dark transition-colors rounded-none">
            Nous Contacter
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * NeighborhoodImpact - Impact sur le quartier
 */
export const NeighborhoodImpact = () => {
  const stats = [
    { value: '500+', label: 'Jeunes Impactés' },
    { value: '16', label: 'Éditions' },
    { value: '100+', label: 'Équipes Participantes' },
    { value: '4', label: 'Années d\'Excellence' }
  ]

  return (
    <div className="bg-brand-green-softer p-6 md:p-8">
      <h3 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-6 text-center">
        Impact sur le Quartier Maya Kopé
      </h3>
      <p className="text-center text-sm md:text-base text-neutral-dark-gray mb-8 max-w-2xl mx-auto">
        TOP FOOT n'est pas juste un tournoi de football. C'est un mouvement qui transforme
        les jeunes du quartier en les donnant une plateforme pour exceller, apprendre le travail d'équipe,
        et rêver grand.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-3 md:p-4 text-center border border-brand-green-light">
            <p className="text-2xl md:text-3xl font-bold text-brand-green mb-1">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-neutral-dark-gray">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
