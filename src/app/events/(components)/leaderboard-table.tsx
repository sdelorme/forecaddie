'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Star, Flag } from 'lucide-react'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui'
import { SearchInput } from '@/components/shared'
import { usePlayerFlagsContext } from '@/components/providers'
import { useSortedLeaderboard } from '@/lib/hooks/use-sorted-leaderboard'
import { formatPlayerName } from '@/lib/utils'
import type { LeaderboardPlayer, LeaderboardEvent } from '@/types/leaderboard'

interface LeaderboardTableProps {
  players: LeaderboardPlayer[]
  eventInfo: LeaderboardEvent
}

function getRoundValue(player: LeaderboardPlayer, roundNumber: 1 | 2 | 3 | 4): string | number {
  const roundScore =
    roundNumber === 1 ? player.r1 : roundNumber === 2 ? player.r2 : roundNumber === 3 ? player.r3 : player.r4

  // During the live round, show "today" in the active round column.
  if (player.round === roundNumber && player.today !== '-') {
    return player.today
  }

  return roundScore ?? '—'
}

function PlayerRow({ player }: { player: LeaderboardPlayer }) {
  const { getPlayerFlag, toggleFavorite, toggleFlag } = usePlayerFlagsContext()
  const { isFavorite, isFlagged } = getPlayerFlag(player.dgId)

  return (
    <TableRow className={isFlagged ? 'bg-flag-highlight/20' : ''}>
      <TableCell className="w-8">
        <div className="flex gap-1.5">
          <button
            onClick={() => toggleFavorite(player.dgId)}
            className="hover:scale-110 transition-transform"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-3.5 h-3.5 stroke-[1.5] ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
            />
          </button>
          <button
            onClick={() => toggleFlag(player.dgId)}
            className="hover:scale-110 transition-transform"
            aria-label={isFlagged ? 'Remove flag' : 'Add flag'}
          >
            <Flag className={`w-3.5 h-3.5 stroke-[1.5] ${isFlagged ? 'text-red-400 fill-red-400' : 'text-gray-500'}`} />
          </button>
        </div>
      </TableCell>
      <TableCell>{player.currentPosition}</TableCell>
      <TableCell>
        <Link href={`/players/${player.dgId}`} className="hover:text-secondary transition-colors">
          {formatPlayerName(player.playerName)}
        </Link>
      </TableCell>
      <TableCell>{player.currentScore}</TableCell>
      <TableCell>{player.thru}</TableCell>
      <TableCell>{getRoundValue(player, 1)}</TableCell>
      <TableCell>{getRoundValue(player, 2)}</TableCell>
      <TableCell>{getRoundValue(player, 3)}</TableCell>
      <TableCell>{getRoundValue(player, 4)}</TableCell>
      <TableCell>{player.winOdds != null ? `${(player.winOdds * 100).toFixed(1)}%` : '—'}</TableCell>
    </TableRow>
  )
}

function filterPlayers(players: LeaderboardPlayer[], search: string): LeaderboardPlayer[] {
  if (!search) return players
  const term = search.toLowerCase().trim()
  return players.filter((p) => p.playerName.toLowerCase().includes(term))
}

export default function LeaderboardTable({ players, eventInfo }: LeaderboardTableProps) {
  const [search, setSearch] = useState('')
  const { starred, rest } = useSortedLeaderboard(players)

  const filteredStarred = useMemo(() => filterPlayers(starred, search), [starred, search])
  const filteredRest = useMemo(() => filterPlayers(rest, search), [rest, search])

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-end mb-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search players..." />
      </div>
      <Table className="text-white">
        <TableCaption>Current Round: {eventInfo.currentRound}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead className="w-[25px]">POS</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Thru</TableHead>
            <TableHead>R1</TableHead>
            <TableHead>R2</TableHead>
            <TableHead>R3</TableHead>
            <TableHead>R4</TableHead>
            <TableHead>Odds to Win</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Starred (favorited) players — visually partitioned at top */}
          {filteredStarred.length > 0 && (
            <>
              {filteredStarred.map((player) => (
                <PlayerRow key={player.dgId} player={player} />
              ))}
              {/* Separator between starred and rest */}
              {filteredRest.length > 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="p-0">
                    <div className="h-px bg-yellow-400/30" />
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
          {/* Remaining players in position order */}
          {filteredRest.map((player) => (
            <PlayerRow key={player.dgId} player={player} />
          ))}
          {filteredStarred.length === 0 && filteredRest.length === 0 && search && (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-400">
                No players match &ldquo;{search}&rdquo;
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
