'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'

interface PlayerRankingsTableProps {
  playerId: string
}

export default function PlayerRankingsTable({ playerId }: PlayerRankingsTableProps) {
  // Placeholder data
  const rankings = [
    { category: 'World Ranking', rank: 1 },
    { category: 'FedEx Cup', rank: 2 },
    { category: 'Scoring Average', rank: 3 },
    { category: 'Driving Distance', rank: 5 },
    { category: 'Greens in Regulation', rank: 4 }
  ]

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Player Rankings for Player {playerId}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Rank</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rankings.map((ranking, index) => (
            <TableRow key={index}>
              <TableCell>{ranking.category}</TableCell>
              <TableCell>{ranking.rank}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
