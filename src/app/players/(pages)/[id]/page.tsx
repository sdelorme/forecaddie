import Image from 'next/image'
import { getPlayerDetail } from '@/lib/api/datagolf'
import PlayerRankingsTable from '../../(components)/player-rankings-table'
import { getPlayerImageUrl } from '@/lib/utils'

type PlayerPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const resolvedParams = await params
  const playerId = Number(resolvedParams.id)
  const detail = await getPlayerDetail(playerId)
  const profile = detail.profile
  const playerName = profile?.playerName ?? `Player ${resolvedParams.id}`
  const playerImage = getPlayerImageUrl(playerName)

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="flex flex-col gap-6 md:flex-row md:items-center bg-gray-800 rounded-lg p-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
            <Image src={playerImage} alt={playerName} fill className="object-cover" sizes="112px" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">DataGolf ID: {Number.isNaN(playerId) ? '—' : playerId}</p>
            <h1 className="text-3xl font-bold text-white">{playerName}</h1>
            {profile ? (
              <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                <span>{profile.country}</span>
                <span>•</span>
                <span>{profile.amateur ? 'Amateur' : 'Professional'}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Player profile details are unavailable.</p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6">
          <PlayerRankingsTable playerName={playerName} rankings={detail.rankings} />
        </div>
      </div>
    </main>
  )
}
