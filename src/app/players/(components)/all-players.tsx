'use client'

import { useState, useMemo } from 'react'
import type { Player } from '@/types/player'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import PlayerSearch from './player-search'
import PlayerFilter from './player-filter'

interface PlayerListUIProps {
  players: Player[]
}

export function PlayerListUI({ players }: PlayerListUIProps) {
  const [searchValue, setSearchValue] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const filter = searchParams.get('filter') || 'all'

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      if (filter !== 'all') {
        const isAmateur = filter === '1'
        if ((player.amateur === 1) !== isAmateur) return false
      }
      if (searchValue) {
        const searchLower = searchValue.toLowerCase().trim()
        return player.displayName.toLowerCase().includes(searchLower)
      }
      return true
    })
  }, [players, filter, searchValue])

  const groupedPlayers = useMemo(() => {
    const groups: Record<string, Player[]> = {}
    filteredPlayers.forEach((player) => {
      const letter = player.firstLetter
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(player)
    })
    return groups
  }, [filteredPlayers])

  const letters = useMemo(() => {
    return Object.keys(groupedPlayers).sort()
  }, [groupedPlayers])

  const handlePlayerClick = (playerId: number) => {
    router.push(`/players/${playerId}`)
  }

  return (
    <div>
      <div className="flex items-center gap-4 [&_[data-state=open]]:mb-16">
        <PlayerSearch value={searchValue} onChange={setSearchValue} />
        <div className="flex items-center">
          <PlayerFilter />
        </div>
      </div>
      {filteredPlayers.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-400">No players found matching your search.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {letters.map((letter) => (
            <div key={letter}>
              <h2 className="text-4xl font-bold text-secondary mb-4 px-4">{letter}</h2>
              {groupedPlayers[letter].map((player) => (
                <div key={player.dgId} className="w-full bg-gray-800">
                  <button
                    onClick={() => handlePlayerClick(player.dgId)}
                    className="w-full text-left flex items-center p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-transparent-700 mr-4 flex-shrink-0">
                      <Image src="/homa-no-bg.png" alt="" fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white truncate">{player.displayName}</h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {player.country} | {player.amateur ? 'Amateur' : 'Professional'}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
