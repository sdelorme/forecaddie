'use client'

import type { Player } from '@/types/player'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { formatPlayerListName, getFirstLetterOfLastName } from '@/lib/utils/player'

interface PlayerListUIProps {
  players: Player[]
}

export function PlayerListUI({ players }: PlayerListUIProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filter = searchParams.get('filter') || 'all'

  const filteredPlayers = players.filter((player) => {
    if (filter === 'all') return true
    if (filter === '0') return player.amateur === 0
    if (filter === '1') return player.amateur === 1
    return true
  })

  if (filteredPlayers.length === 0) {
    return <p className="text-center text-gray-400 mt-8">No players found.</p>
  }

  let currentLetter = ''

  const handlePlayerClick = (playerId: number) => {
    router.push(`/players/${playerId}`)
  }

  return (
    <div className="flex flex-col gap-1">
      {filteredPlayers.map((player) => {
        const fullName = formatPlayerListName(player)
        const firstLetterOfLastName = getFirstLetterOfLastName(player.playerName)

        const showLetterHeader = firstLetterOfLastName !== currentLetter
        if (showLetterHeader) {
          currentLetter = firstLetterOfLastName
        }

        return (
          <div key={player.dgId} className="w-full">
            {showLetterHeader && <h2 className="text-4xl font-bold text-secondary mb-4 px-4">{currentLetter}</h2>}
            <div className="w-full bg-gray-800">
              <button
                onClick={() => handlePlayerClick(player.dgId)}
                className="w-full text-left flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-transparent-700 mr-4 flex-shrink-0">
                  <Image src="/homa-no-bg.png" alt="" fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white truncate">{fullName}</h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    {player.country} | {player.amateur ? 'Amateur' : 'Professional'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
