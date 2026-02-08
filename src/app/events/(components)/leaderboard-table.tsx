'use client'

import Link from 'next/link'
import { Star, Flag } from 'lucide-react'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui'
import { usePlayerFlagsContext } from '@/components/providers'
import { useSortedLeaderboard } from '@/lib/hooks/use-sorted-leaderboard'
import type { LeaderboardPlayer, LeaderboardEvent } from '@/types/leaderboard'

interface LeaderboardTableProps {
  players: LeaderboardPlayer[]
  eventInfo: LeaderboardEvent
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
          {player.playerName}
        </Link>
      </TableCell>
      <TableCell>{player.currentScore}</TableCell>
      <TableCell>{player.thru}</TableCell>
      <TableCell>{player.r1}</TableCell>
      <TableCell>{player.r2}</TableCell>
      <TableCell>{player.r3}</TableCell>
      <TableCell>{player.r4}</TableCell>
      <TableCell>{player.winOdds != null ? `${(player.winOdds * 100).toFixed(1)}%` : '—'}</TableCell>
    </TableRow>
  )
}

export default function LeaderboardTable({ players, eventInfo }: LeaderboardTableProps) {
  const { starred, rest } = useSortedLeaderboard(players)

  return (
    <div className="bg-gray-800 rounded-lg p-4">
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
          {starred.length > 0 && (
            <>
              {starred.map((player) => (
                <PlayerRow key={player.dgId} player={player} />
              ))}
              {/* Separator between starred and rest */}
              <TableRow>
                <TableCell colSpan={10} className="p-0">
                  <div className="h-px bg-yellow-400/30" />
                </TableCell>
              </TableRow>
            </>
          )}
          {/* Remaining players in position order */}
          {rest.map((player) => (
            <PlayerRow key={player.dgId} player={player} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
