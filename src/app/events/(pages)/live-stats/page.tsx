import { Suspense } from 'react'
import { getLiveLeaderboard } from '@/data/fetch-live-leaderboard'
import { LeaderboardPlayer } from '@/types/leaderboard'
import { getScoreStyle } from '@/lib/utils/live-stats-helpers'

export default async function LiveStatsPage() {
  const { players, event } = await getLiveLeaderboard()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{event.name}</h1>
        <p className="text-gray-400">
          {event.course} • Last updated:{' '}
          {new Date(event.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 animate-pulse">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 h-24 rounded-lg" />
            ))}
          </div>
        }
      >
        <div className="grid gap-4">
          {players.map((player: LeaderboardPlayer) => (
            <div
              key={player.dg_id}
              className="bg-gray-900 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 w-8">{player.position}</span>
                  <span className="text-white font-semibold">
                    {player.player_name}
                  </span>
                </div>
                <div className="text-gray-400 text-sm ml-12">
                  {player.status}
                </div>
              </div>
              <div className="text-xl font-mono">
                <span className={getScoreStyle(player.score, 'text')}>
                  {player.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  )
}
