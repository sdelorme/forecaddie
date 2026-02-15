import { getSchedule } from '@/lib/api/datagolf/queries/schedule'
import { getHistoricalEventResults } from '@/lib/api/datagolf/queries/historical-events'
import { DashboardClient } from './(components)/dashboard-client'
import type { CompletedEventResult } from './types'

export default async function DashboardPage() {
  let schedule: Awaited<ReturnType<typeof getSchedule>> = []

  try {
    schedule = await getSchedule()
  } catch {
    // Degrade gracefully — continue with empty schedule
  }

  const currentYear =
    schedule.length > 0
      ? new Date(schedule[schedule.length - 1].startDate + 'T00:00:00').getFullYear()
      : new Date().getFullYear()

  const completedEvents = schedule.filter(
    (event) => event.isComplete && new Date(event.startDate + 'T00:00:00').getFullYear() === currentYear
  )

  const eventResults = await Promise.allSettled(
    completedEvents.map(async (event): Promise<CompletedEventResult> => {
      const results = await getHistoricalEventResults(Number(event.eventId), currentYear)

      // Sort finishers by position and take the top 3.
      // Preserves actual finish text (e.g. "T2") so ties display correctly.
      const topFinishers = results
        .filter((r) => r.finishPosition !== null && r.status === 'finished')
        .sort((a, b) => a.finishPosition! - b.finishPosition!)
        .slice(0, 3)
        .map((r) => ({
          playerName: r.playerName,
          finishText: r.finishText
        }))

      return {
        eventId: event.eventId,
        eventName: event.eventName,
        startDate: event.startDate,
        course: event.course,
        topFinishers
      }
    })
  )

  const completedWithResults: CompletedEventResult[] = eventResults
    .filter((result): result is PromiseFulfilledResult<CompletedEventResult> => result.status === 'fulfilled')
    .map((result) => result.value)

  return <DashboardClient completedEvents={completedWithResults} />
}
