import { getPlayerList } from '@/lib/api/datagolf'
import { PlayerListUI } from '../(components)/all-players'

export const metadata = {
  title: 'Player Rankings',
  description: 'PGA Tour player rankings, statistics, and DataGolf skill ratings.'
}

export default async function PlayersPage() {
  const players = await getPlayerList()

  return (
    <main className="min-h-screen flex flex-col">
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">PGA Tour Players</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full">
          <PlayerListUI players={players} />
        </div>
      </div>
    </main>
  )
}
