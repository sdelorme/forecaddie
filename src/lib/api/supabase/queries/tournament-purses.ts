import { createAdminClient } from '@/lib/supabase/server'
import type { ProcessedTourEvent } from '@/types/schedule'

/**
 * Fetch all purse amounts for a season, returning a Map keyed by DG event ID.
 * Uses the admin client so no auth/RLS overhead — purse data is public.
 * Returns an empty map if Supabase env vars are missing (e.g. during build).
 */
export async function getPurseMap(season: number): Promise<Map<string, number>> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('tournament_purses').select('dg_event_id, purse').eq('season', season)

    if (error) {
      console.error('Failed to fetch tournament purses:', error.message)
      return new Map()
    }

    const map = new Map<string, number>()
    for (const row of data) {
      map.set(row.dg_event_id, row.purse)
    }
    return map
  } catch {
    return new Map()
  }
}

/**
 * Attach purse amounts to schedule events in-place (returns new array).
 */
export function attachPurses(events: ProcessedTourEvent[], purseMap: Map<string, number>): ProcessedTourEvent[] {
  return events.map((e) => {
    const purse = purseMap.get(e.eventId)
    return purse !== undefined ? { ...e, purse } : e
  })
}
