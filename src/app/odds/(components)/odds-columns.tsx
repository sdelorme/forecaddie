import { type ColumnDef } from '@tanstack/react-table'
import { type NormalizedPlayerOdds } from '@/lib/api/datagolf/types/odds'
import { formatPlayerName } from '@/lib/utils'

function parseOdds(value: string): number {
  if (!value) return Number.MAX_SAFE_INTEGER
  const num = Number(value)
  return Number.isNaN(num) ? Number.MAX_SAFE_INTEGER : num
}

export const oddsColumns: ColumnDef<NormalizedPlayerOdds>[] = [
  {
    accessorKey: 'playerName',
    header: 'Player',
    cell: ({ getValue }) => formatPlayerName(getValue<string>()),
    sortingFn: (rowA, rowB) =>
      formatPlayerName(rowA.original.playerName).localeCompare(formatPlayerName(rowB.original.playerName)),
    filterFn: (row, _columnId, filterValue: string) =>
      row.original.playerName.toLowerCase().includes(filterValue.toLowerCase().trim())
  },
  {
    accessorKey: 'fanduel',
    header: 'FanDuel',
    meta: { align: 'right' as const },
    sortingFn: (rowA, rowB) => parseOdds(rowA.original.fanduel) - parseOdds(rowB.original.fanduel)
  },
  {
    accessorKey: 'draftkings',
    header: 'DraftKings',
    meta: { align: 'right' as const },
    sortingFn: (rowA, rowB) => parseOdds(rowA.original.draftkings) - parseOdds(rowB.original.draftkings)
  },
  {
    accessorKey: 'betmgm',
    header: 'BetMGM',
    meta: { align: 'right' as const },
    sortingFn: (rowA, rowB) => parseOdds(rowA.original.betmgm) - parseOdds(rowB.original.betmgm)
  },
  {
    accessorKey: 'datagolfBaselineHistoryFit',
    header: 'DataGolf',
    meta: { align: 'right' as const },
    sortingFn: (rowA, rowB) =>
      parseOdds(rowA.original.datagolfBaselineHistoryFit) - parseOdds(rowB.original.datagolfBaselineHistoryFit)
  }
]
