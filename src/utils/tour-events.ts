import { TourEvent } from '@/types/schedule'
import moment from 'moment'

/**
 * Determine if an event is 'live', 'historical', or 'future'.
 */
export function getTournamentType(
  event: TourEvent,
  currentDate: moment.Moment
): 'live' | 'historical' | 'future' {
  const startDate = moment.utc(event.start_date, 'YYYY-MM-DD')
  const endDate = startDate.clone().add(5, 'days')

  if (currentDate.isBetween(startDate, endDate, 'day', '[]')) {
    return 'live'
  }
  if (currentDate.isAfter(endDate)) {
    return 'historical'
  }
  return 'future'
}

/**
 * Get the appropriate event link based on the tournament type.
 */
export function getEventHref(event: TourEvent, tournamentType: string): string {
  switch (tournamentType) {
    case 'live':
      return `/events/live-stats`
    case 'historical':
      return `/events/${event.event_id}`
    case 'future':
      return `/events/future`
    default:
      return '/events'
  }
}

/**
 * Determine if an event should be transparent (inactive due to being in the past).
 */
export function isTransparent(
  startDate: string,
  currentDate: moment.Moment
): boolean {
  const eventDate = moment.utc(startDate, 'YYYY-MM-DD')
  return currentDate.isAfter(eventDate.add(5, 'days'))
}

/**
 * Get the most relevant current or upcoming event.
 */
export function getCurrentEvent(
  events: TourEvent[],
  currentDate: moment.Moment
): TourEvent | null {
  if (!events || events.length === 0) return null

  // Find live events
  const liveEvent = events.find(
    (event) => getTournamentType(event, currentDate) === 'live'
  )
  if (liveEvent) return liveEvent

  // Find the nearest future event
  const futureEvents = events.filter(
    (event) => getTournamentType(event, currentDate) === 'future'
  )
  if (futureEvents.length > 0) {
    return futureEvents.reduce((closest, event) => {
      const eventDate = moment.utc(event.start_date, 'YYYY-MM-DD')
      const closestDate = moment.utc(closest.start_date, 'YYYY-MM-DD')
      return eventDate.isBefore(closestDate) ? event : closest
    })
  }

  // If no live or future events, return the most recent historical event
  const historicalEvents = events.filter(
    (event) => getTournamentType(event, currentDate) === 'historical'
  )
  if (historicalEvents.length > 0) {
    return historicalEvents.reduce((latest, event) => {
      const eventDate = moment.utc(event.start_date, 'YYYY-MM-DD')
      const latestDate = moment.utc(latest.start_date, 'YYYY-MM-DD')
      return eventDate.isAfter(latestDate) ? event : latest
    })
  }

  return null
}
