'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'

interface PreviousRoundsTableProps {
  playerId: string
}

export default function PreviousRoundsTable({ playerId }: PreviousRoundsTableProps) {
  // Placeholder data
  const rounds = [
    {
      tournament: 'Masters Tournament',
      date: '2023-04-09',
      score: -12,
      position: 1
    },
    {
      tournament: 'PGA Championship',
      date: '2023-05-21',
      score: -8,
      position: 3
    },
    { tournament: 'U.S. Open', date: '2023-06-18', score: -6, position: 5 }
  ]

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Previous Rounds for Player {playerId}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tournament</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Position</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rounds.map((round, index) => (
            <TableRow key={index}>
              <TableCell>{round.tournament}</TableCell>
              <TableCell>{round.date}</TableCell>
              <TableCell>{round.score}</TableCell>
              <TableCell>{round.position}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
