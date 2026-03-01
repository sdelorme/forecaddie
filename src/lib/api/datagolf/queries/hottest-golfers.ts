import { getSchedule } from './schedule'
import { getHistoricalEventResults } from './historical-events'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { PlayerEventFinish } from '@/types/historical-events'
import type { RecentFormMap } from '@/types/hottest-golfers'

const CUT_WD_DQ_POSITION = 70
const MIN_FINISHES_REQUIRED = 2
const LAST_N_EVENTS = 5

function getYearFromStartDate(startDate: string): number {
  const year = parseInt(startDate.slice(0, 4), 10)
  return Number.isNaN(year) ? new Date().getFullYear() : year
}

/**
 * Converts a finish to a numeric position for averaging.
 * CUT/WD/DQ/MDF count as 70 per requirements.
 */
function toNumericPosition(finish: PlayerEventFinish): number {
  if (finish.finishPosition !== null) return finish.finishPosition
  return CUT_WD_DQ_POSITION
}

/**
 * Computes average finish position over last 5 completed PGA events.
 * Uses getHistoricalEventResults; CUT/WD/DQ count as 70; requires min 2 finishes.
 * Caching: reuses historical event results cache (1 week).
 */
export async function getHottestGolfers(): Promise<RecentFormMap> {
  const schedule = await getSchedule()
  const completed = schedule
    .filter((e) => e.isComplete)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .slice(0, LAST_N_EVENTS)

  if (completed.length === 0) return new Map()

  const resultsArrays = await Promise.all(
    completed.map((e: ProcessedTourEvent) =>
      getHistoricalEventResults(Number(e.eventId), getYearFromStartDate(e.startDate))
    )
  )

  const byPlayer = new Map<number, number[]>()
  resultsArrays.forEach((finishes) => {
    finishes.forEach((f) => {
      const pos = toNumericPosition(f)
      const existing = byPlayer.get(f.dgId) ?? []
      existing.push(pos)
      byPlayer.set(f.dgId, existing)
    })
  })

  const out = new Map<number, number>()
  byPlayer.forEach((positions, dgId) => {
    if (positions.length < MIN_FINISHES_REQUIRED) return
    const avg = positions.reduce((a, b) => a + b, 0) / positions.length
    out.set(dgId, Math.round(avg * 10) / 10)
  })
  return out
}
