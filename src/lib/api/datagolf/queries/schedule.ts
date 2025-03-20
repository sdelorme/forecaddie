import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { processEvents } from '@/lib/utils/tour-events'
import type { RawTourSchedule, RawTourEvent } from '../types/schedule'
import type { ProcessedTourEvent, TourEvent } from '@/types/schedule'

function normalizeEvent(event: RawTourEvent): TourEvent {
  return {
    course: event.course,
    courseKey: event.course_key,
    eventId: event.event_id,
    eventName: event.event_name,
    latitude: event.latitude,
    location: event.location,
    longitude: event.longitude,
    startDate: event.start_date
  }
}

export async function getSchedule(): Promise<ProcessedTourEvent[]> {
  try {
    const response = await dataGolfClient<RawTourSchedule>(ENDPOINTS.SCHEDULE, {
      revalidate: REVALIDATE_INTERVALS.SCHEDULE,
      tags: [CACHE_TAGS.SCHEDULE],
      params: {
        tour: 'pga'
      }
    })

    if (!response?.schedule) {
      console.error('Invalid schedule response:', response)
      return []
    }

    const normalizedEvents = response.schedule.map(normalizeEvent)
    return processEvents(normalizedEvents)
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return []
  }
}
