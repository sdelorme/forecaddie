'use client'

import { useMemo, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PlayerSearch } from '@/app/dashboard/[id]/(components)/player-search'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'
import type { PlayerEventFinish } from '@/types/historical-events'

interface PlanPlayerTableProps {
  players: Player[]
  usedPlayerIds: number[]
  onSelectPlayer: (playerDgId: number) => void
  onClearPick: () => void
  currentPick: Pick | undefined
  selectedEventName?: string
  historicalYears: number[]
  historicalFinishes: Map<number, PlayerEventFinish[]>
  isLoadingHistory: boolean
}

function finishCellClass(finish: PlayerEventFinish | undefined): string {
  if (!finish) return 'text-gray-600'
  if (finish.status === 'cut' || finish.status === 'wd' || finish.status === 'dq') {
    return 'text-red-400'
  }
  if (finish.status === 'mdf') {
    return 'text-red-400/70'
  }
  if (finish.finishPosition !== null && finish.finishPosition <= 3) {
    return 'text-yellow-400 font-semibold'
  }
  return 'text-gray-300'
}

/**
 * Returns a numeric rank for sorting players by finish position.
 * Lower = better: numeric position first, then non-finish statuses, then no data.
 */
function finishSortRank(finish: PlayerEventFinish | undefined): number {
  if (!finish) return 10000 // no data — sort last
  if (finish.finishPosition !== null) return finish.finishPosition // 1, 2, 3...
  return 5000 // CUT/WD/DQ/MDF — after all finishers, before no-data
}

export function PlanPlayerTable({
  players,
  usedPlayerIds,
  onSelectPlayer,
  onClearPick,
  currentPick,
  selectedEventName,
  historicalYears,
  historicalFinishes,
  isLoadingHistory
}: PlanPlayerTableProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const hasHistory = historicalYears.length > 0

  const finishLookup = useMemo(() => {
    const lookup = new Map<number, Map<number, PlayerEventFinish>>()
    historicalFinishes.forEach((finishes, year) => {
      const byPlayer = new Map<number, PlayerEventFinish>()
      finishes.forEach((f) => byPlayer.set(f.dgId, f))
      lookup.set(year, byPlayer)
    })
    return lookup
  }, [historicalFinishes])

  const currentPlayer = useMemo(() => {
    if (!currentPick?.player_dg_id) return null
    return players.find((p) => p.dgId === currentPick.player_dg_id) ?? null
  }, [currentPick, players])

  // Sort by most recent prior-year finish (asc) when history is loaded,
  // otherwise alphabetical. Players with a numeric finish come first,
  // then non-finishers (CUT/WD/DQ/MDF), then players with no data.
  const sortedPlayers = useMemo(() => {
    const mostRecentYear = historicalYears[0] // already sorted desc
    const yearLookup = !isLoadingHistory && mostRecentYear ? finishLookup.get(mostRecentYear) : undefined

    return [...players].sort((a, b) => {
      if (!yearLookup) return a.displayName.localeCompare(b.displayName)

      const fa = yearLookup.get(a.dgId)
      const fb = yearLookup.get(b.dgId)

      // Sort rank: finished (by position) → non-finish status → no data
      const rankA = finishSortRank(fa)
      const rankB = finishSortRank(fb)

      if (rankA !== rankB) return rankA - rankB
      return a.displayName.localeCompare(b.displayName)
    })
  }, [players, historicalYears, finishLookup, isLoadingHistory])

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return sortedPlayers
    const term = searchTerm.toLowerCase()
    return sortedPlayers.filter(
      (p) => p.displayName.toLowerCase().includes(term) || p.playerName.toLowerCase().includes(term)
    )
  }, [sortedPlayers, searchTerm])

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
      <p className="mb-2 text-xs text-gray-400">{filtered.length} players</p>

      {/* Player table */}
      <div className="max-h-[28rem] overflow-y-auto overflow-x-auto">
        {filtered.length === 0 && searchTerm.trim() !== '' && (
          <p className="py-8 text-center text-sm text-gray-500">No players matching &apos;{searchTerm}&apos;</p>
        )}

        {filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-800">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
                <th className="sticky left-0 z-20 bg-gray-800 py-2 pr-3 pl-1 font-medium">Player</th>
                {hasHistory &&
                  historicalYears.map((year) => (
                    <th key={year} className="py-2 px-2 text-center font-medium whitespace-nowrap">
                      {isLoadingHistory ? (
                        <span className="inline-flex items-center gap-1">
                          {year}
                          <Loader2 className="h-3 w-3 animate-spin" />
                        </span>
                      ) : (
                        year
                      )}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filtered.map((player) => {
                const isUsed = usedPlayerIds.includes(player.dgId)
                const isCurrent = currentPick?.player_dg_id === player.dgId
                const isDisabled = isUsed || isCurrent

                return (
                  <tr
                    key={player.dgId}
                    role="button"
                    tabIndex={isDisabled ? undefined : 0}
                    aria-disabled={isDisabled || undefined}
                    onClick={isDisabled ? undefined : () => onSelectPlayer(player.dgId)}
                    onKeyDown={
                      isDisabled
                        ? undefined
                        : (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              onSelectPlayer(player.dgId)
                            }
                          }
                    }
                    className={cn(
                      'group transition-colors',
                      isDisabled ? 'opacity-50 cursor-default' : 'cursor-pointer hover:bg-gray-700',
                      isCurrent && 'bg-green-900/20 opacity-100'
                    )}
                  >
                    <td className="sticky left-0 z-10 bg-gray-800 group-hover:bg-gray-700 transition-colors py-2 pr-3 pl-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate text-white">{player.displayName}</span>
                        {isUsed && (
                          <span className="flex-shrink-0 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                            Used
                          </span>
                        )}
                        {isCurrent && (
                          <span className="flex-shrink-0 rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                            Selected
                          </span>
                        )}
                      </div>
                    </td>
                    {hasHistory &&
                      historicalYears.map((year) => {
                        if (isLoadingHistory) {
                          return (
                            <td key={year} className="py-2 px-2 text-center">
                              <div className="mx-auto h-4 w-8 animate-pulse rounded bg-gray-700" />
                            </td>
                          )
                        }
                        const finish = finishLookup.get(year)?.get(player.dgId)
                        return (
                          <td
                            key={year}
                            className={cn('py-2 px-2 text-center whitespace-nowrap', finishCellClass(finish))}
                          >
                            {finish ? finish.finishText : '—'}
                          </td>
                        )
                      })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
