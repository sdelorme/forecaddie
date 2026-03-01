import OddsTable from './(components)/odds-table'
import { OddsHeader } from './(components)/odds-header'
import { NormalizedOddsData } from '@/lib/api/datagolf/types/odds'
import { getOutrightOdds } from '@/lib/api/datagolf/queries/odds'
import { getSchedule } from '@/lib/api/datagolf'
import { getPurseMap, attachPurses } from '@/lib/api/supabase/queries/tournament-purses'
import { getCurrentEvent, getNextEvent } from '@/lib/utils'

export const metadata = {
  title: 'Betting Odds',
  description: 'Current PGA Tour tournament betting odds from major sportsbooks.'
}

export default async function OddsPage() {
  const [oddsData, rawSchedule] = (await Promise.all([getOutrightOdds(), getSchedule()])) as [
    NormalizedOddsData,
    Awaited<ReturnType<typeof getSchedule>>
  ]
  const season =
    rawSchedule.length > 0 ? new Date(rawSchedule[0].startDate + 'T00:00:00').getFullYear() : new Date().getFullYear()
  const purseMap = await getPurseMap(season)
  const schedule = attachPurses(rawSchedule, purseMap)

  const now = new Date()
  const currentEvent = getCurrentEvent(schedule, now)
  const isComplete = currentEvent?.status === 'completed'
  const nextEvent = getNextEvent(schedule, now)

  return (
    <main className="container mx-auto px-4 py-8">
      <OddsHeader eventName={oddsData.eventName} isComplete={isComplete} nextEvent={nextEvent} />
      <OddsTable odds={oddsData} />
    </main>
  )
}
