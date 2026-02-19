import { getSchedule } from '@/lib/api/datagolf/queries/schedule'
import { getPlayerList } from '@/lib/api/datagolf/queries/players'
import { getHistoricalEventList, getHistoricalEventResults } from '@/lib/api/datagolf/queries/historical-events'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PlanDetailClient } from './(components)/plan-detail-client'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import type { HistoricalEventEntry } from '@/types/historical-events'
import type { PriorYearTopFinishers } from '../types'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PlanDetailPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const planResult = await supabase.from('season_plans').select('*').eq('id', id).single()

  if (planResult.error || !planResult.data) {
    notFound()
  }

  const plan = planResult.data

  let events: ProcessedTourEvent[] = []
  let players: Player[] = []
  let historicalEvents: HistoricalEventEntry[] = []

  try {
    const [scheduleResult, playerResult, historicalResult] = await Promise.allSettled([
      getSchedule(),
      getPlayerList(),
      getHistoricalEventList()
    ])
    events = scheduleResult.status === 'fulfilled' ? scheduleResult.value : []
    players = playerResult.status === 'fulfilled' ? playerResult.value : []
    historicalEvents = historicalResult.status === 'fulfilled' ? historicalResult.value : []
  } catch {
    // All failed — continue with empty arrays
  }

  const seasonEvents = events.filter((e) => e.startDate.startsWith(String(plan.season)))
  const completedSeasonEvents = seasonEvents.filter((e) => e.isComplete)

  // Build earnings map for completed events
  const earningsMap: Record<string, Record<number, number>> = {}
  if (completedSeasonEvents.length > 0) {
    const earningsResults = await Promise.allSettled(
      completedSeasonEvents.map((e) => getHistoricalEventResults(Number(e.eventId), plan.season))
    )
    completedSeasonEvents.forEach((event, i) => {
      const result = earningsResults[i]
      if (result.status === 'fulfilled') {
        const map: Record<number, number> = {}
        result.value.forEach((finish) => {
          if (finish.earnings != null) {
            map[finish.dgId] = finish.earnings
          }
        })
        earningsMap[event.eventId] = map
      }
    })
  }

  // Build prior year top-5 finishers for each event (cached 1 week)
  const priorYearResults: Record<string, PriorYearTopFinishers> = {}
  const eventsToFetch = seasonEvents
    .map((event) => {
      const numericId = Number(event.eventId)
      const priorEntry = historicalEvents
        .filter((h) => h.eventId === numericId && h.calendarYear < plan.season)
        .sort((a, b) => b.calendarYear - a.calendarYear)[0]
      return priorEntry ? { eventId: event.eventId, numericId, year: priorEntry.calendarYear } : null
    })
    .filter(Boolean) as Array<{ eventId: string; numericId: number; year: number }>

  if (eventsToFetch.length > 0) {
    const priorResults = await Promise.allSettled(
      eventsToFetch.map((e) => getHistoricalEventResults(e.numericId, e.year))
    )
    eventsToFetch.forEach((event, i) => {
      const result = priorResults[i]
      if (result.status === 'fulfilled') {
        const top5 = result.value
          .filter((f) => f.finishPosition !== null && f.status === 'finished')
          .sort((a, b) => a.finishPosition! - b.finishPosition!)
          .slice(0, 5)
          .map((f) => ({ playerName: f.playerName, finishText: f.finishText }))
        priorYearResults[event.eventId] = { year: event.year, topFinishers: top5 }
      }
    })
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-4rem)]">
      <PlanDetailClient
        planId={plan.id}
        planName={plan.name}
        season={plan.season}
        events={events}
        players={players}
        historicalEvents={historicalEvents}
        earningsMap={earningsMap}
        priorYearResults={priorYearResults}
      />
    </main>
  )
}
