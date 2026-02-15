import { getSchedule } from '@/lib/api/datagolf/queries/schedule'
import { getHistoricalEventResults } from '@/lib/api/datagolf/queries/historical-events'
import { DashboardClient } from './(components)/dashboard-client'
import type { CompletedEventPodium } from './types'

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

  const podiumResults = await Promise.allSettled(
    completedEvents.map(async (event): Promise<CompletedEventPodium> => {
      const results = await getHistoricalEventResults(Number(event.eventId), currentYear)

      const podium = results
        .filter((r) => r.finishPosition !== null && r.finishPosition >= 1 && r.finishPosition <= 3)
        .sort((a, b) => a.finishPosition! - b.finishPosition!)
        .map((r) => ({
          position: r.finishPosition!,
          playerName: r.playerName
        }))

      return {
        eventId: event.eventId,
        eventName: event.eventName,
        startDate: event.startDate,
        course: event.course,
        podium
      }
    })
  )

  const completedWithPodium: CompletedEventPodium[] = podiumResults
    .filter((result): result is PromiseFulfilledResult<CompletedEventPodium> => result.status === 'fulfilled')
    .map((result) => result.value)

  return <DashboardClient completedEvents={completedWithPodium} />
}
