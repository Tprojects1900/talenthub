import React from 'react'

export const GroupTable = ({ group }) => {
  return (
    <div className="bg-[#f3f4f6] border border-gray-100 rounded-2xl p-4 shadow-sm">
      <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">
        {group.name}
      </h3>

      <div className="space-y-2">
        {group.teams.slice(0, 4).map((team, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-gray-400 w-4">
                {index + 1}
              </span>

              <img
                src={team.logo}
                alt={team.name}
                className="w-6 h-4 object-cover rounded-sm"
              />

              <span className="text-sm font-medium text-gray-700">
                {team.name}
              </span>
            </div>

            {team.from && (
              <span className="text-xs text-gray-400">
                {team.from}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}