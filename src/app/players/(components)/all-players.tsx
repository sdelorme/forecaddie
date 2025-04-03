'use client'

import { useState, useRef } from 'react'
import type { Player } from '@/types/player'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { formatPlayerListName, getFirstLetterOfLastName } from '@/lib/utils/player'
import PlayerSearch, { PlayerSearchHandle } from './player-search'
import PlayerFilter from './player-filter'

interface PlayerListUIProps {
  players: Player[]
}

export function PlayerListUI({ players }: PlayerListUIProps) {
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<PlayerSearchHandle>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const filter = searchParams.get('filter') || 'all'

  const filteredPlayers = players.filter((player) => {
    // First apply the amateur/pro filter
    if (filter !== 'all') {
      const isAmateur = filter === '1'
      if ((player.amateur === 1) !== isAmateur) return false
    }

    // Then apply the search filter if there is one
    if (searchValue) {
      const searchLower = searchValue.toLowerCase()
      const playerName = player.playerName.toLowerCase()
      if (!playerName.includes(searchLower)) return false
    }

    return true
  })

  let currentLetter = ''

  const handlePlayerClick = (playerId: number) => {
    router.push(`/players/${playerId}`)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    searchRef.current?.clear()
  }

  return (
    <div>
      <div className="flex items-center gap-4 [&_[data-state=open]]:mb-16">
        <PlayerSearch ref={searchRef} onChange={setSearchValue} />
        <div className="flex items-center">
          <PlayerFilter />
        </div>
      </div>
      {filteredPlayers.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-400 mb-4">No players found matching your search.</p>
          {searchValue && (
            <button onClick={handleClearSearch} className="text-primary hover:text-primary/80 text-sm">
              Clear search
            </button>
          )}
        </div>
      ) : (
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
      )}
    </div>
  )
}
