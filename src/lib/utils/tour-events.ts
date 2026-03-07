import { TourEvent, ProcessedTourEvent } from '@/types/schedule'
import { getTournamentStartDate, isTournamentInProgress, isTournamentComplete } from './tournament-time'

/**
 * Maps a tournament to its display type using a hybrid approach:
 * 1. Trust the DataGolf API status when it reports 'in_progress' or 'completed'
 * 2. Fall back to date-based heuristics when status is 'upcoming', because the
 *    schedule endpoint may be cached (up to 1 hour) and the status field stale
 *
 * This supports multiple simultaneous live events (e.g. main + alternate week).
 */
export function getTournamentType(event: TourEvent, currentDate: Date): 'live' | 'historical' | 'future' {
  if (event.status === 'in_progress') return 'live'
  if (event.status === 'completed') return 'historical'

  // status === 'upcoming' — may be stale from cache, check dates
  if (isTournamentInProgress(event.startDate, currentDate)) return 'live'
  if (isTournamentComplete(event.startDate, currentDate)) return 'historical'
  return 'future'
}

export function getEventHref(event: TourEvent): string {
  return `/events/${event.eventId}`
}

function isLive(event: TourEvent, currentDate: Date): boolean {
  return (
    event.status === 'in_progress' ||
    (event.status === 'upcoming' && isTournamentInProgress(event.startDate, currentDate))
  )
}

function isUpcoming(event: TourEvent, currentDate: Date): boolean {
  return (
    event.status === 'upcoming' &&
    !isTournamentInProgress(event.startDate, currentDate) &&
    !isTournamentComplete(event.startDate, currentDate)
  )
}

/**
 * Gets the current event to display based on the following priority:
 * 1. In-progress tournament (if multiple, pick the latest start date)
 * 2. Next upcoming tournament
 * 3. Most recently completed tournament
 */
export function getCurrentEvent(events: TourEvent[], currentDate: Date): TourEvent | null {
  if (!events?.length) return null

  const liveEvents = events.filter((e) => isLive(e, currentDate))
  if (liveEvents.length > 0) {
    return liveEvents.sort((a, b) => {
      const aDate = getTournamentStartDate(a.startDate)
      const bDate = getTournamentStartDate(b.startDate)
      return bDate.getTime() - aDate.getTime()
    })[0]
  }

  const upcomingEvents = events.filter((e) => isUpcoming(e, currentDate))
  if (upcomingEvents.length > 0) {
    return upcomingEvents.sort((a, b) => {
      const aDate = getTournamentStartDate(a.startDate)
      const bDate = getTournamentStartDate(b.startDate)
      return aDate.getTime() - bDate.getTime()
    })[0]
  }

  const completedEvents = events.filter((e) => getTournamentType(e, currentDate) === 'historical')
  if (completedEvents.length > 0) {
    return completedEvents.sort((a, b) => {
      const aDate = getTournamentStartDate(a.startDate)
      const bDate = getTournamentStartDate(b.startDate)
      return bDate.getTime() - aDate.getTime()
    })[0]
  }

  return null
}

/**
 * Gets the next upcoming tournament (earliest start date with upcoming status).
 */
export function getNextEvent(events: TourEvent[], currentDate: Date): TourEvent | null {
  const upcomingEvents = events.filter((e) => isUpcoming(e, currentDate))
  if (!upcomingEvents.length) return null

  return upcomingEvents.sort((a, b) => {
    const aDate = getTournamentStartDate(a.startDate)
    const bDate = getTournamentStartDate(b.startDate)
    return aDate.getTime() - bDate.getTime()
  })[0]
}

export function processEvents(events: TourEvent[], currentDate: Date = new Date()): ProcessedTourEvent[] {
  return events
    .map((event) => {
      const type = getTournamentType(event, currentDate)
      return {
        ...event,
        tournamentType: type,
        href: getEventHref(event),
        isComplete: type === 'historical'
      }
    })
    .sort(sortEvents)
}

const TYPE_ORDER: Record<string, number> = { live: 0, future: 1, historical: 2 }

function sortEvents(a: ProcessedTourEvent, b: ProcessedTourEvent): number {
  const orderDiff = (TYPE_ORDER[a.tournamentType] ?? 1) - (TYPE_ORDER[b.tournamentType] ?? 1)
  if (orderDiff !== 0) return orderDiff

  const aDate = getTournamentStartDate(a.startDate)
  const bDate = getTournamentStartDate(b.startDate)
  return aDate.getTime() - bDate.getTime()
}
