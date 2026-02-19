import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { RawTourScheduleSchema } from '../schemas/schedule'
import { processEvents } from '@/lib/utils'
import type { RawTourEvent } from '../types/schedule'
import type { ProcessedTourEvent, TourEvent } from '@/types/schedule'

function formatWinner(raw: string): string {
  if (!raw || raw === 'TBD') return raw
  const stripped = raw.replace(/\s*\(\d+\)\s*$/, '').trim()
  const parts = stripped.split(', ')
  if (parts.length < 2) return stripped
  return `${parts[1]} ${parts[0]}`
}

function normalizeEvent(event: RawTourEvent): TourEvent {
  return {
    country: event.country,
    course: event.course,
    courseKey: event.course_key,
    eventId: event.event_id,
    eventName: event.event_name,
    latitude: event.latitude,
    location: event.location,
    longitude: event.longitude,
    startDate: event.start_date,
    status: event.status,
    winner: formatWinner(event.winner)
  }
}

export async function getSchedule(): Promise<ProcessedTourEvent[]> {
  try {
    const response = await dataGolfClient<unknown>(ENDPOINTS.SCHEDULE, {
      revalidate: REVALIDATE_INTERVALS.SCHEDULE,
      tags: [CACHE_TAGS.SCHEDULE],
      params: {
        tour: 'pga'
      }
    })

    const parsed = RawTourScheduleSchema.safeParse(response)
    if (!parsed.success) {
      console.error('Invalid schedule response:', parsed.error.format())
      return []
    }

    const normalizedEvents = parsed.data.schedule.map(normalizeEvent)
    return processEvents(normalizedEvents)
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return []
  }
}
