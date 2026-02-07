import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import type { PlayerTournamentResult } from '@/types/player-detail'

interface PreviousRoundsTableProps {
  playerName: string
  history: PlayerTournamentResult[]
}

export default function PreviousRoundsTable({ playerName, history }: PreviousRoundsTableProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold text-white mb-4">Tournament History for {playerName}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tournament</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Finish</TableHead>
            <TableHead>Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-gray-400">
                No recent tournament results available for this player.
              </TableCell>
            </TableRow>
          ) : (
            history.map((result, index) => (
              <TableRow key={`${result.eventName}-${index}`}>
                <TableCell>{result.eventName}</TableCell>
                <TableCell>{result.year ?? '—'}</TableCell>
                <TableCell>{result.finishPosition ?? '—'}</TableCell>
                <TableCell>{result.earnings != null ? `$${result.earnings.toLocaleString()}` : '—'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
