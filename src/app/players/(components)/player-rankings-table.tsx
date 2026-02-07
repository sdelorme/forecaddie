import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import type { PlayerRanking } from '@/types/player-detail'

interface PlayerRankingsTableProps {
  playerName: string
  rankings: PlayerRanking[]
}

export default function PlayerRankingsTable({ playerName, rankings }: PlayerRankingsTableProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Rankings for {playerName}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Rank</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-gray-400">
                No rankings available for this player yet.
              </TableCell>
            </TableRow>
          ) : (
            rankings.map((ranking) => (
              <TableRow key={ranking.label}>
                <TableCell>{ranking.label}</TableCell>
                <TableCell>{ranking.value}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
