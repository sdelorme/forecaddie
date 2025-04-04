'use client'

import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { LeaderboardPlayer, LeaderboardEvent } from '@/types/leaderboard'

interface LeaderboardTableProps {
  players: LeaderboardPlayer[]
  eventInfo: LeaderboardEvent
}

export default function LeaderboardTable({ players, eventInfo }: LeaderboardTableProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <Table className="text-white">
        <TableCaption>Current Round: {eventInfo.currentRound}</TableCaption>
        <TableHeader>
          <TableRow>
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
          {players.map((player) => (
            <TableRow key={player.dgId}>
              <TableCell>{player.currentPosition}</TableCell>
              <TableCell>{player.playerName}</TableCell>
              <TableCell>{player.currentScore}</TableCell>
              <TableCell>{player.thru}</TableCell>
              <TableCell>{player.r1}</TableCell>
              <TableCell>{player.r2}</TableCell>
              <TableCell>{player.r3}</TableCell>
              <TableCell>{player.r4}</TableCell>
              <TableCell>{(player.winOdds * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
