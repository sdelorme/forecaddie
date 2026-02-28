import { LiveStatsProvider } from '@/components/providers'
import LeaderboardContainer from '../../(containers)/leaderboard-container'
import { LeaderboardHeader } from '../../(components)/leaderboard-header'
import { getLiveLeaderboard, getSchedule } from '@/lib/api/datagolf'
import { getPurseMap, attachPurses } from '@/lib/api/supabase/queries/tournament-purses'
import { getCurrentEvent, getNextEvent } from '@/lib/utils'

export const metadata = {
  title: 'Live Leaderboard',
  description: 'Real-time PGA Tour tournament leaderboard with live scoring updates.'
}

export default async function LiveStatsPage() {
  const [leaderboard, rawSchedule] = await Promise.all([getLiveLeaderboard(), getSchedule()])
  const season =
    rawSchedule.length > 0 ? new Date(rawSchedule[0].startDate + 'T00:00:00').getFullYear() : new Date().getFullYear()
  const purseMap = await getPurseMap(season)
  const schedule = attachPurses(rawSchedule, purseMap)

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
