import { LiveStatsProvider } from '@/components/providers/live-stats-provider'
import LeaderboardContainer from '../../(containers)/leaderboard-container'
import { LeaderboardHeader } from '../../(components)/leaderboard-header'
import { getLiveLeaderboard, getSchedule } from '@/lib/api/datagolf'
import { getCurrentEvent, getNextEvent } from '@/lib/utils/tour-events'

export const metadata = {
  title: 'Live Leaderboard',
  description: 'Real-time PGA Tour tournament leaderboard with live scoring updates.'
}

export default async function LiveStatsPage() {
  const [leaderboard, schedule] = await Promise.all([getLiveLeaderboard(), getSchedule()])

  const now = new Date()
  const currentEvent = getCurrentEvent(schedule, now)
  const isComplete = currentEvent?.status === 'completed'
  const nextEvent = getNextEvent(schedule, now)

  return (
    <LiveStatsProvider initialData={leaderboard} isComplete={isComplete}>
      <div className="mt-12">
        <LeaderboardHeader eventInfo={leaderboard.eventInfo} isComplete={isComplete} nextEvent={nextEvent} />
        <LeaderboardContainer />
      </div>
    </LiveStatsProvider>
  )
}
