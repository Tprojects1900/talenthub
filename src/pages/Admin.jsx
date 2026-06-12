import { useState } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import { Container, Section } from '../components/Layout/Container'
import { LogOut } from 'lucide-react'

/**
 * Admin - Page d'administration
 */
export const Admin = ({ onClose }) => {
  const { isAuthenticated, adminData, login, logout, addEvent, updateEvent, deleteEvent } = useAdmin()
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [activeTab, setActiveTab] = useState('events')

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'match',
    title: '',
    team1Name: '',
    team1Initials: '',
    team2Name: '',
    team2Initials: '',
    location: ''
  })

  const handleLogin = (e) => {
    e.preventDefault()
    const success = login(password)
    if (!success) {
      setPasswordError('Mot de passe incorrect')
      setPassword('')
    } else {
      setPasswordError('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddEvent = (e) => {
    e.preventDefault()
    if (!formData.date || !formData.time || !formData.type) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const newEvent = {
      date: formData.date,
      time: formData.time,
      type: formData.type,
      title: formData.title,
      location: formData.location,
      ...(formData.type === 'match' && {
        team1: { name: formData.team1Name, initials: formData.team1Initials },
        team2: { name: formData.team2Name, initials: formData.team2Initials },
        status: 'scheduled'
      })
    }

    addEvent(newEvent)
    setFormData({
      date: '',
      time: '',
      type: 'match',
      title: '',
      team1Name: '',
      team1Initials: '',
      team2Name: '',
      team2Initials: '',
      location: ''
    })
    alert('Événement ajouté avec succès!')
  }

  // Non authentifié - Formulaire de connexion
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-neutral-dark mb-6">Connexion Admin</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange"
                placeholder="Entrez le mot de passe admin"
              />
              {passwordError && (
                <p className="text-error text-sm mt-2">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors rounded-none"
            >
              Se connecter
            </button>
          </form>
          <button
            onClick={onClose}
            className="w-full mt-3 px-4 py-2 bg-neutral-light-gray text-neutral-dark font-semibold hover:bg-neutral-gray transition-colors rounded-none"
          >
            Fermer
          </button>
        </div>
      </div>
    )
  }

  // Authentifié
  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50">
      <div className="min-h-screen bg-neutral-off-white">
        {/* Header */}
        <div className="bg-white border-b border-neutral-light-gray sticky top-0 z-10">
          <Container>
            <div className="flex justify-between items-center h-16 md:h-20">
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-dark">
                Panneau Admin TOP FOOT
              </h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-error text-white font-semibold hover:opacity-90 transition-opacity rounded-none"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </Container>
        </div>

        {/* Content */}
        <Container className="py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-neutral-light-gray">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-3 font-semibold transition-colors ${
                activeTab === 'events'
                  ? 'text-brand-orange border-b-2 border-brand-orange -mb-2'
                  : 'text-neutral-dark-gray hover:text-neutral-dark'
              }`}
            >
              Événements
            </button>
            <button
              onClick={() => setActiveTab('infos')}
              className={`px-4 py-3 font-semibold transition-colors ${
                activeTab === 'infos'
                  ? 'text-brand-orange border-b-2 border-brand-orange -mb-2'
                  : 'text-neutral-dark-gray hover:text-neutral-dark'
              }`}
            >
              Infos Dynamiques
            </button>
          </div>

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="lg:col-span-1 bg-white p-6 border border-neutral-light-gray">
                <h3 className="text-xl font-bold text-neutral-dark mb-4">
                  Ajouter un événement
                </h3>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-1">
                      Heure *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-1">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                    >
                      <option value="match">Match</option>
                      <option value="drawing">Tirage</option>
                      <option value="meeting">Réunion</option>
                    </select>
                  </div>

                  {formData.type === 'match' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-dark mb-1">
                          Équipe 1 - Nom
                        </label>
                        <input
                          type="text"
                          name="team1Name"
                          value={formData.team1Name}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-dark mb-1">
                          Équipe 1 - Initiales
                        </label>
                        <input
                          type="text"
                          name="team1Initials"
                          value={formData.team1Initials}
                          onChange={handleFormChange}
                          maxLength="2"
                          className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-dark mb-1">
                          Équipe 2 - Nom
                        </label>
                        <input
                          type="text"
                          name="team2Name"
                          value={formData.team2Name}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-dark mb-1">
                          Équipe 2 - Initiales
                        </label>
                        <input
                          type="text"
                          name="team2Initials"
                          value={formData.team2Initials}
                          onChange={handleFormChange}
                          maxLength="2"
                          className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                        />
                      </div>
                    </>
                  )}

                  {(formData.type === 'drawing' || formData.type === 'meeting') && (
                    <div>
                      <label className="block text-sm font-semibold text-neutral-dark mb-1">
                        Titre
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-neutral-dark mb-1">
                      Lieu
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-neutral-light-gray rounded-none focus:outline-none focus:border-brand-orange text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors rounded-none text-sm"
                  >
                    Ajouter l'événement
                  </button>
                </form>
              </div>

              {/* Events List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-neutral-dark">
                  Événements ({adminData.events?.length || 0})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {adminData.events && adminData.events.length > 0 ? (
                    adminData.events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white p-4 border border-neutral-light-gray flex justify-between items-start"
                      >
                        <div className="text-sm">
                          <p className="font-semibold text-neutral-dark">
                            {event.date} à {event.time}
                          </p>
                          <p className="text-neutral-dark-gray">
                            {event.title || `${event.team1?.name} vs ${event.team2?.name}`}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="px-3 py-1 bg-error text-white text-xs font-semibold hover:opacity-90 transition-opacity rounded-none"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-dark-gray text-sm">Aucun événement pour le moment</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Infos Tab */}
          {activeTab === 'infos' && (
            <div className="bg-white p-6 border border-neutral-light-gray">
              <h3 className="text-xl font-bold text-neutral-dark mb-4">
                Infos Dynamiques (À implémenter)
              </h3>
              <p className="text-neutral-dark-gray">
                Cette section permet de modifier les infos dynamiques affichées quand il n'y a pas d'événement.
              </p>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}
