import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { RawHistoricalEventListSchema, RawHistoricalEventResultsResponseSchema } from '../schemas/historical-events'
import { normalizeHistoricalEvent, normalizeEventFinish } from '../mappers/historical-events'
import type { HistoricalEventEntry, PlayerEventFinish } from '@/types/historical-events'

export async function getHistoricalEventList(): Promise<HistoricalEventEntry[]> {
  try {
    const response = await dataGolfClient<unknown>(ENDPOINTS.EVENT_LIST, {
      revalidate: REVALIDATE_INTERVALS.HISTORICAL_EVENT_LIST,
      tags: [CACHE_TAGS.HISTORICAL_EVENT_LIST],
      params: {
        tour: 'pga',
        file_format: 'json'
      }
    })

    const parsed = RawHistoricalEventListSchema.safeParse(response)
    if (!parsed.success) {
      console.error('Invalid historical event list response:', parsed.error.format())
      return []
    }

    return parsed.data.map(normalizeHistoricalEvent)
  } catch (error) {
    console.error('Error fetching historical event list:', error)
    return []
  }
}

export async function getHistoricalEventResults(eventId: number, year: number): Promise<PlayerEventFinish[]> {
  try {
    const response = await dataGolfClient<unknown>(ENDPOINTS.HISTORICAL_EVENT_RESULTS, {
      revalidate: REVALIDATE_INTERVALS.HISTORICAL_EVENT_RESULTS,
      tags: [CACHE_TAGS.HISTORICAL_EVENT_RESULTS],
      params: {
        tour: 'pga',
        event_id: String(eventId),
        year: String(year),
        file_format: 'json'
      }
    })

    const parsed = RawHistoricalEventResultsResponseSchema.safeParse(response)
    if (!parsed.success) {
      console.error('Invalid historical event results response:', parsed.error.format())
      return []
    }

    return parsed.data.event_stats.map(normalizeEventFinish)
  } catch (error) {
    console.error('Error fetching historical event results:', error)
    return []
  }
}
