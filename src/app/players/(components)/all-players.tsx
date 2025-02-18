'use client'

import type { Player } from '@/types/player'
import Link from 'next/link'
import Image from 'next/image'

import { useSearchParams } from 'next/navigation'
import {
  formatPlayerListName,
  getFirstLetterOfLastName,
} from '@/lib/utils/player'

interface PlayerListUIProps {
  players: Player[]
}

export function PlayerListUI({ players }: PlayerListUIProps) {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter') || 'all'

  const filteredPlayers = players.filter((player) => {
    if (filter === 'all') return true
    if (filter === 'pro') return player.amateur === 0
    if (filter === 'amateur') return player.amateur === 1
    return true
  })

  if (filteredPlayers.length === 0) {
    return <p className="text-center text-gray-400 mt-8">No players found.</p>
  }

  let currentLetter = ''

  return (
    <div className="w-full max-w-4xl mx-auto">
      {filteredPlayers.map((player) => {
        const fullName = formatPlayerListName(player)
        const firstLetterOfLastName = getFirstLetterOfLastName(
          player.player_name
        )

        const showLetterHeader = firstLetterOfLastName !== currentLetter
        if (showLetterHeader) {
          currentLetter = firstLetterOfLastName
        }

        return (
          <div key={player.dg_id}>
            {showLetterHeader && (
              <h2 className="text-4xl font-bold text-secondary mb-4 px-4 mt-8">
                {currentLetter}
              </h2>
            )}
            <div className="bg-gray-800 rounded-lg shadow mb-4">
              <Link
                href={`/players/${player.dg_id}`}
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-transparent-700 mr-4">
                  <Image
                    src="/homa-no-bg.png"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {fullName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    {player.country} |{' '}
                    {player.amateur ? 'Amateur' : 'Professional'}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
