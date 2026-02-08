'use client'

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PlayerSearch } from '@/app/dashboard/[id]/(components)/player-search'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'

const MAX_VISIBLE = 50

interface PlanPlayerTableProps {
  players: Player[]
  usedPlayerIds: number[]
  onSelectPlayer: (playerDgId: number) => void
  onClearPick: () => void
  currentPick: Pick | undefined
  selectedEventName?: string
}

export function PlanPlayerTable({
  players,
  usedPlayerIds,
  onSelectPlayer,
  onClearPick,
  currentPick,
  selectedEventName
}: PlanPlayerTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const currentPlayer = useMemo(() => {
    if (!currentPick?.player_dg_id) return null
    return players.find((p) => p.dgId === currentPick.player_dg_id) ?? null
  }, [currentPick, players])

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [players]
  )

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return sortedPlayers
    const term = searchTerm.toLowerCase()
    return sortedPlayers.filter(
      (p) => p.displayName.toLowerCase().includes(term) || p.playerName.toLowerCase().includes(term)
    )
  }, [sortedPlayers, searchTerm])

  const visible = filtered.slice(0, MAX_VISIBLE)

  const heading = selectedEventName ? `Select player for ${selectedEventName}` : 'Select a player'

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      {/* Header */}
      <h2 className="mb-3 text-lg font-semibold text-white">{heading}</h2>

      {/* Current pick banner */}
      {currentPlayer && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-green-900/30 border border-green-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">{currentPlayer.displayName}</span>
            <span className="text-xs text-gray-400">{currentPlayer.country}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearPick}
            className="h-7 gap-1 text-xs text-red-400 hover:text-red-300"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="mb-3">
        <PlayerSearch value={searchTerm} onChange={setSearchTerm} placeholder="Search by player name..." />
      </div>

      {/* Result count */}
      <p className="mb-2 text-xs text-gray-400">
        Showing {visible.length} of {filtered.length} players
      </p>

      {/* Player list */}
      <div className="max-h-[28rem] overflow-y-auto pr-1 space-y-1">
        {visible.length === 0 && searchTerm.trim() !== '' && (
          <p className="py-8 text-center text-sm text-gray-500">No players matching &apos;{searchTerm}&apos;</p>
        )}

        {visible.map((player) => {
          const isUsed = usedPlayerIds.includes(player.dgId)
          const isCurrent = currentPick?.player_dg_id === player.dgId

          return (
            <div
              key={player.dgId}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 transition-colors',
                'hover:bg-gray-700/50',
                isUsed && 'opacity-50'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate text-sm text-white">{player.displayName}</span>
                <span className="flex-shrink-0 text-xs text-gray-400">{player.country}</span>
                {isUsed && (
                  <span className="flex-shrink-0 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                    Used
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={isUsed || isCurrent}
                onClick={() => onSelectPlayer(player.dgId)}
                className={cn('h-7 text-xs', isCurrent ? 'text-green-400' : 'text-gray-300 hover:text-white')}
              >
                {isCurrent ? 'Selected' : 'Select'}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
