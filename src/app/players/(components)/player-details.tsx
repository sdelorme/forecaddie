'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PreviousRoundsTable from './previous-rounds-table'
import PlayerRankingsTable from './player-rankings-table'

export default function PlayerDetails() {
  const searchParams = useSearchParams()
  const selectedPlayerId = searchParams.get('player')

  if (!selectedPlayerId) {
    return null
  }

  return (
    <div className="space-y-8 lg:h-[calc(100vh-200px)] lg:overflow-y-auto">
      <h2 className="text-2xl font-bold text-white">
        Player ID: {selectedPlayerId}
      </h2>
      <Suspense
        fallback={
          <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse" />
        }
      >
        <PreviousRoundsTable playerId={selectedPlayerId} />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-64 bg-gray-800/50 rounded-lg animate-pulse" />
        }
      >
        <PlayerRankingsTable playerId={selectedPlayerId} />
      </Suspense>
    </div>
  )
}
