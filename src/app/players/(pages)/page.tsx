import { Suspense } from 'react'
import { getPlayerList } from '@/lib/api/datagolf'
import { PlayerListUI } from '../(components)/all-players'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Player Rankings',
  description: 'PGA Tour player rankings, statistics, and DataGolf skill ratings.'
}

export default async function PlayersPage() {
  const players = await getPlayerList()

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">PGA Tour Players</h1>
      <Suspense fallback={<div className="py-8 text-gray-400">Loading players...</div>}>
        <PlayerListUI players={players} />
      </Suspense>
    </div>
  )
}
