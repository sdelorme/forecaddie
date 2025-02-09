import { Player } from '@/types/player'
import { formatPlayerNameDesktop } from '@/lib/utils/player'
import Link from 'next/link'

interface AllPlayerProps {
  players: Player[]
}

export default function AllPlayers({ players }: AllPlayerProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-4">
      {players.map((player: Player) => {
        const playerName = formatPlayerNameDesktop(player)

        return (
          <Link
            key={player.dg_id}
            href={{
              pathname: `/players/${player.dg_id}`,
            }}
            className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 ease-in-out"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {playerName}
            </h2>
            <p className="text-sm text-gray-600">{player.country}</p>
          </Link>
        )
      })}
    </div>
  )
}
