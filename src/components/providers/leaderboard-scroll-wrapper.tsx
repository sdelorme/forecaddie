'use client'

import { useLiveStats } from './live-stats-provider'
import { useSortedLeaderboard } from '@/lib/hooks/use-sorted-leaderboard'
import { LeaderboardScroll } from '../shared/leaderboard-scroll'

function LeaderboardSkeleton() {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-1 sm:gap-1 p-1 sm:p-1 scrollbar-hide bg-primary border-b-[1px]">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex-none snap-center bg-white/10 text-white p-1 sm:p-2 rounded-sm shadow-sm min-w-[56px] sm:min-w-[180px] border border-white/10"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse" />
            <div className="w-16 h-3 bg-white/20 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LeaderboardScrollWrapper() {
  const { players, eventInfo, loading, isComplete } = useLiveStats()
  const { starred, rest } = useSortedLeaderboard(players)

  if (loading) {
    return <LeaderboardSkeleton />
  }

  return <LeaderboardScroll starred={starred} rest={rest} eventInfo={eventInfo} isComplete={isComplete} />
}
