'use client'

import { useLiveStats } from '@/components/providers/live-stats-provider'
import LeaderboardTable from '../(components)/leaderboard-table'
import { LeaderboardSkeleton } from '../(components)/leaderboard-skeleton'

export default function LeaderboardContainer() {
  const { players, eventInfo, loading, error } = useLiveStats()

  if (loading) return <LeaderboardSkeleton />
  if (error) return <div>Error: {error}</div>

  return <LeaderboardTable players={players} eventInfo={eventInfo} />
}
