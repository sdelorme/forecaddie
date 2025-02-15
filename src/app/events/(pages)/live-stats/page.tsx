import { Suspense } from 'react'
import { getLiveLeaderboard } from '@/data/fetch-live-leaderboard'
import { LiveLeaderboard } from '../../(components)/live-tournament-stats'

export default async function LiveStatsPage() {
  // TODO: Calling this here and in leaderboard. SHould share state
  const { players, eventInfo } = await getLiveLeaderboard()

  return (
    <Suspense
      fallback={
        <div className="grid gap-4 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 h-24 rounded-lg" />
          ))}
        </div>
      }
    >
      <LiveLeaderboard players={players} eventInfo={eventInfo} />
    </Suspense>
  )
}
