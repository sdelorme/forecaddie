'use client'

import { useState } from 'react'
import { NormalizedOddsData } from '@/lib/api/datagolf/types/odds'
import { DataTable } from '@/components/ui'
import { SearchInput } from '@/components/shared'
import { oddsColumns } from './odds-columns'

interface OddsTableProps {
  odds: NormalizedOddsData
}

export default function OddsTable({ odds }: OddsTableProps) {
  const [search, setSearch] = useState('')

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-end mb-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search players..." />
      </div>
      <DataTable
        columns={oddsColumns}
        data={odds.players}
        caption={odds.eventName}
        filterValue={search}
        filterColumnId="playerName"
        noResultsMessage={search ? `No players match \u201c${search}\u201d` : 'No results.'}
        tableClassName="text-white"
      />
    </div>
  )
}
