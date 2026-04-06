import { createAdminClient } from '@/lib/supabase/server'
import type { ProcessedTourEvent } from '@/types/schedule'

export interface PurseEntry {
  purse: number
  isUserAdded: boolean
}

/**
 * Fetch all purse amounts for a season, returning a Map keyed by DG event ID.
 * Uses the admin client so no auth/RLS overhead — purse data is public.
 * Returns an empty map if Supabase env vars are missing (e.g. during build).
 *
 * `isUserAdded` is true when `updated_by` is set (i.e. submitted by a user
 * rather than seeded via migration).
 */
export async function getPurseMap(season: number): Promise<Map<string, PurseEntry>> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('tournament_purses')
      .select('dg_event_id, purse, updated_by')
      .eq('season', season)

    if (error) {
      console.error('Failed to fetch tournament purses:', error.message)
      return new Map()
    }

    const map = new Map<string, PurseEntry>()
    for (const row of data) {
      map.set(row.dg_event_id, {
        purse: row.purse,
        isUserAdded: row.updated_by != null
      })
    }
    return map
  } catch {
    return new Map()
  }
}

/**
 * Attach purse amounts to schedule events (returns new array).
 */
export function attachPurses(events: ProcessedTourEvent[], purseMap: Map<string, PurseEntry>): ProcessedTourEvent[] {
  return events.map((e) => {
    const entry = purseMap.get(e.eventId)
    return entry !== undefined ? { ...e, purse: entry.purse, purseIsUserAdded: entry.isUserAdded } : e
  })
}
