'use client'

import { useLiveStats } from '@/components/providers/live-stats-provider'
import LeaderboardTable from '../(components)/leaderboard-table'

export default function LeaderboardContainer() {
  const { players, eventInfo, loading, error } = useLiveStats()

  if (loading) return <div>Golf is the best...</div>
  if (error) return <div>Error: {error}</div>

  return <LeaderboardTable players={players} eventInfo={eventInfo} />
}
