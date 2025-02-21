import { Suspense } from 'react'
import type { Player } from '@/types/player'
import { PlayerListUI } from '../(components)/all-players'
import PlayerFilter from '../(components)/player-filter'
import PlayerDetails from '../(components)/player-details'

async function getPlayers(): Promise<Player[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/players/list`, {
    next: { revalidate: 14400 }, // 4 hours
  })
  const data = await res.json()
  return data.players
}

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <main className="min-h-screen flex flex-col">
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">PGA Tour Players</h1>
        <Suspense fallback={<div>Loading player filter...</div>}>
          <PlayerFilter />
        </Suspense>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <PlayerListUI players={players} />
          </Suspense>
        </div>
        <div className="w-full lg:w-1/2 p-4">
          <div className="lg:sticky lg:top-8">
            <Suspense fallback={<div>Loading player details...</div>}>
              <PlayerDetails />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}
