import { LiveStatsProvider } from '@/components/providers/live-stats-provider'
import LeaderboardContainer from '../../(containers)/leaderboard-container'

export default function LiveStatsPage() {
  return (
    <LiveStatsProvider>
      <div className="mt-12">
        <LeaderboardContainer />
      </div>
    </LiveStatsProvider>
  )
}
