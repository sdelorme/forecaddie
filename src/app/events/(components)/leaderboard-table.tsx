'use client'

import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useLiveStats } from '@/components/providers/live-stats-provider'

export default function LeaderboardTable() {
  const { players, eventInfo, loading, error } = useLiveStats()

  if (loading) return <div>Golf is the best...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Table>
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
            <TableCell>{player.winOdds}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
