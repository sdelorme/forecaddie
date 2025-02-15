import { Suspense } from 'react'
import { getLiveLeaderboard } from '@/data/fetch-live-leaderboard'
import LiveLeaderboard2 from '../../(components)/live-leaderboard'

export default async function LiveStatsPage() {
  // TODO: Calling this here and in leaderboard. SHould share state
  // TODO: Move over to the LiveLeaderboard2 component, set props up
  // Liveleaderboard2 should be Left Aligned, leaving room for PLayerLiveStats component on right side.
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
      {/* <LiveLeaderboard players={players} eventInfo={eventInfo} /> */}
      <div className="mt-12">
        <LiveLeaderboard2 />
      </div>
    </Suspense>
  )
}
