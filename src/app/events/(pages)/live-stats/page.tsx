import { Suspense } from 'react'
import { LiveStatsProvider } from '@/components/providers/live-stats-provider'
import LeaderboardTable from '../../(components)/leaderboard-table'

export default function LiveStatsPage() {
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
      <LiveStatsProvider>
        <div className="mt-12">
          <LeaderboardTable />
        </div>
      </LiveStatsProvider>
    </Suspense>
  )
}
