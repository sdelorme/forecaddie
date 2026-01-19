import { LiveStatsProvider } from '@/components/providers/live-stats-provider'
import LeaderboardContainer from '../../(containers)/leaderboard-container'

export const metadata = {
  title: 'Live Leaderboard',
  description: 'Real-time PGA Tour tournament leaderboard with live scoring updates.'
}

export default function LiveStatsPage() {
  return (
    <LiveStatsProvider>
      <div className="mt-12">
        <LeaderboardContainer />
      </div>
    </LiveStatsProvider>
  )
}
