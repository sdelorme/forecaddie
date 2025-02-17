import { TourEvent } from '@/types/schedule'

function isBetweenDates(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end
}

/**
 * Determine if an event is 'live', 'historical', or 'future'.
 */
export function getTournamentType(
  event: TourEvent,
  currentDate: Date
): 'live' | 'historical' | 'future' {
  const startDate = new Date(event.start_date)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 4) // Tournament typically lasts 4 days
  endDate.setHours(23, 59, 59, 999) // Set to end of the day

  if (currentDate >= startDate && currentDate <= endDate) {
    return 'live'
  }
  if (currentDate > endDate) {
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
export function isTransparent(startDate: string, currentDate: Date): boolean {
  const eventDate = new Date(startDate)
  return currentDate > new Date(eventDate.setDate(eventDate.getDate() + 5))
}

/**
 * Get the most relevant current or upcoming event.
 */
export function getCurrentEvent(
  events: TourEvent[],
  currentDate: Date
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
      const eventDate = new Date(event.start_date)
      const closestDate = new Date(closest.start_date)
      return eventDate < closestDate ? event : closest
    })
  }

  // If no live or future events, return the most recent historical event
  const historicalEvents = events.filter(
    (event) => getTournamentType(event, currentDate) === 'historical'
  )
  if (historicalEvents.length > 0) {
    return historicalEvents.reduce((latest, event) => {
      const eventDate = new Date(event.start_date)
      const latestDate = new Date(latest.start_date)
      return eventDate > latestDate ? event : latest
    })
  }

  return null
}

export function processEvents(events: TourEvent[]) {
  const now = new Date()
  return events
    .map((event) => ({
      ...event,
      tournamentType: getTournamentType(event, now),
      href: getEventHref(event, getTournamentType(event, now)),
      isComplete: isEventCompleted(event.start_date, now),
    }))
    .sort(sortEvents)
}

function isEventCompleted(startDate: string, now: Date): boolean {
  return now > getEventEndDate(startDate)
}

function getEventEndDate(startDate: string): Date {
  const eventDate = new Date(startDate)
  const endDate = new Date(eventDate)
  endDate.setDate(eventDate.getDate() + 4)
  endDate.setHours(23, 59, 59, 999)
  return endDate
}

function sortEvents(a: TourEvent, b: TourEvent) {
  const now = new Date()
  const aEndDate = getEventEndDate(a.start_date)
  const bEndDate = getEventEndDate(b.start_date)
  const aStartDate = new Date(a.start_date)
  const bStartDate = new Date(b.start_date)

  const aIsCurrent = aStartDate <= now && now <= aEndDate
  const bIsCurrent = bStartDate <= now && now <= bEndDate

  if (aIsCurrent && !bIsCurrent) return -1
  if (!aIsCurrent && bIsCurrent) return 1

  const aIsUpcoming = aStartDate > now
  const bIsUpcoming = bStartDate > now

  if (aIsUpcoming && !bIsUpcoming) return -1
  if (!aIsUpcoming && bIsUpcoming) return 1

  return aStartDate.getTime() - bStartDate.getTime()
}
