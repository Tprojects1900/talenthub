import React from 'react'
export const MatchCard = ({ match }) => {
    
  const isLive =
    match.status === 'En cours' ||
    match.status === 'Mi-temps'

  return (
  
    <div className="bg-zinc-50 rounded-2xl p-4 flex items-center justify-between shadow-sm max-w-md mx-auto w-full">
      {/* Équipe A */}
      <div className="flex flex-col items-center flex-1">
        <div className="relative">
          <img
            src={match.teamA.logo}
            alt={match.teamA.name}
            className="w-12 h-8 object-cover rounded shadow-sm border border-gray-200"
          />
          {/* <button className="absolute -top-2 -right-2 bg-[#007AEB] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">
            +
          </button> */}
        </div>

        <span className="mt-2 font-bold text-gray-700 text-sm tracking-wide">
          {match.teamA.code}
        </span>
      </div>

      {/* Informations centrales */}
      <div className="flex flex-col items-center justify-center flex-1 px-2 text-center">
        <span className="text-xs text-gray-600 font-medium mb-1">
          {match.groupName}
        </span>

        <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-gray-800">
          {match.status !== 'Bientôt' ? (
            <>
              <span>{match.scoreA}</span>
              <span className="text-gray-400 font-normal">-</span>
              <span>{match.scoreB}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-gray-500">
              VS
            </span>
          )}
        </div>

        <span
          className={`text-xs mt-1 font-semibold ${
            isLive
              ? 'text-red-500 animate-pulse'
              : 'text-gray-600'
          }`}
        >
          {match.status}
          {/* {match.dateInfo ? ` • ${match.dateInfo}` : ''} */}
        </span>
          <span
          className={`text-xs mt-1 font-semibold ${
            isLive
              ? 'text-red-500 animate-pulse'
              : 'text-gray-600'
          }`}
        >
          {/* {match.status} */}
          {match.dateInfo ? ` • ${match.dateInfo}` : ''}
        </span>
      </div>

      {/* Équipe B */}
      <div className="flex flex-col items-center flex-1">
        <div className="relative">
          <img
            src={match.teamB.logo}
            alt={match.teamB.name}
            className="w-12 h-8 object-cover rounded shadow-sm border border-gray-200"
          />
          {/* <button className="absolute -top-2 -right-2 bg-[#007AEB] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">
            +
          </button> */}
        </div>

        <span className="mt-2 font-bold text-gray-700 text-sm tracking-wide">
          {match.teamB.code}
        </span>
      </div>
    </div>
  
  )
}