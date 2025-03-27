'use client'

import { NormalizedOddsData } from '@/lib/api/datagolf/types/odds'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table'

interface OddsTableProps {
  odds: NormalizedOddsData
}

export default function OddsTable({ odds }: OddsTableProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <Table className="text-white">
        <TableCaption>{odds.eventName}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">FanDuel</TableHead>
            <TableHead className="text-right">DraftKings</TableHead>
            <TableHead className="text-right">BetMGM</TableHead>
            <TableHead className="text-right">DataGolf</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {odds.players.map((player) => (
            <TableRow key={player.dgId}>
              <TableCell>{player.playerName}</TableCell>
              <TableCell className="text-right">{player.fanduel}</TableCell>
              <TableCell className="text-right">{player.draftkings}</TableCell>
              <TableCell className="text-right">{player.betmgm}</TableCell>
              <TableCell className="text-right">{player.datagolfBaselineHistoryFit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
