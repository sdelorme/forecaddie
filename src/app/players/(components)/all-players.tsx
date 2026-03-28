'use client'

import { useState, useMemo } from 'react'
import type { Player } from '@/types/player'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getPlayerImageUrl } from '@/lib/utils'
import { useAuth } from '@/lib/supabase/hooks/use-auth'
import { usePlayerFlagsContext } from '@/components/providers'
import PlayerSearch from './player-search'
import PlayerFilter from './player-filter'

function FavoritePill({ dgId }: { dgId: number }) {
  const { getPlayerFlag, toggleFavorite } = usePlayerFlagsContext()
  const { isFavorite } = getPlayerFlag(dgId)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(dgId)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        isFavorite ? 'bg-secondary/20 text-secondary' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-secondary text-secondary' : ''}`} />
      Favorite
    </button>
  )
}

interface PlayerListUIProps {
  players: Player[]
}

export function PlayerListUI({ players }: PlayerListUIProps) {
  const [searchValue, setSearchValue] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const filter = searchParams.get('filter') || '0'

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
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePlayerClick(player.dgId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handlePlayerClick(player.dgId)
                      }
                    }}
                    className="w-full text-left flex items-center p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-transparent-700 mr-4 flex-shrink-0">
                      <Image
                        src={getPlayerImageUrl(player.displayName)}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white truncate">{player.displayName}</h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        {player.country} | {player.amateur ? 'Amateur' : 'Professional'}
                      </p>
                    </div>
                    {user && <FavoritePill dgId={player.dgId} />}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
