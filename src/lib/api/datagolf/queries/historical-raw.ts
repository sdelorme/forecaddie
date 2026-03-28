import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { RawHistoricalRawEventListSchema, RawHistoricalRawRoundsResponseSchema } from '../schemas/historical-raw'
import { normalizeRawEvent, normalizeRawPlayerResult } from '../mappers/historical-raw'
import { sortByResult } from '@/lib/utils/sort-results'
import type { HistoricalRawEvent, HistoricalRawPlayerResult } from '@/types/historical-raw'

export async function getHistoricalRawEventList(): Promise<HistoricalRawEvent[]> {
  try {
    const response = await dataGolfClient<unknown>(ENDPOINTS.RAW_EVENT_LIST, {
      revalidate: REVALIDATE_INTERVALS.RAW_EVENT_LIST,
      tags: [CACHE_TAGS.RAW_EVENT_LIST],
      params: {
        tour: 'pga',
        file_format: 'json'
      }
    })

    const parsed = RawHistoricalRawEventListSchema.safeParse(response)
    if (!parsed.success) {
      console.error('Invalid raw event list response:', parsed.error.format())
      return []
    }

    return parsed.data.map(normalizeRawEvent)
  } catch (error) {
    console.error('Error fetching raw historical event list:', error)
    return []
  }
}

export async function getHistoricalRawRounds(eventId: number, year: number): Promise<HistoricalRawPlayerResult[]> {
  try {
    const response = await dataGolfClient<unknown>(ENDPOINTS.RAW_ROUNDS, {
      revalidate: REVALIDATE_INTERVALS.RAW_ROUNDS,
      tags: [CACHE_TAGS.RAW_ROUNDS],
      params: {
        tour: 'pga',
        event_id: String(eventId),
        year: String(year),
        file_format: 'json'
      }
    })

    const parsed = RawHistoricalRawRoundsResponseSchema.safeParse(response)
    if (!parsed.success) {
      console.error('Invalid raw rounds response:', parsed.error.format())
      return []
    }

    return sortByResult(parsed.data.scores.map(normalizeRawPlayerResult), {
      status: (p) => p.status,
      position: (p) => p.finishPosition,
      score: (p) => p.totalScore,
      name: (p) => p.playerName
    })
  } catch (error) {
    console.error('Error fetching raw historical rounds:', error)
    return []
  }
}
