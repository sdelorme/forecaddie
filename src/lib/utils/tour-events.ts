import { TourEvent, ProcessedTourEvent } from '@/types/schedule'
import { getTournamentStartDate } from './tournament-time'

/**
 * Determines if a tournament is in the future based on its start date
 */
function isFutureTournament(event: TourEvent, currentDate: Date): boolean {
  const startDate = getTournamentStartDate(event.startDate)
  // Compare dates only, not times
  const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  return currentDay < startDay
}

/**
 * Gets the most recent tournament from a list of events
 * This is the tournament with the latest start date that isn't in the future
 */
function getMostRecentTournament(events: TourEvent[], currentDate: Date): TourEvent | null {
  const pastAndCurrentEvents = events.filter((event) => !isFutureTournament(event, currentDate))
  if (!pastAndCurrentEvents.length) return null

  // Sort by start date ascending and take the last one (most recent non-future)
  return pastAndCurrentEvents.sort((a, b) => {
    const aDate = getTournamentStartDate(a.startDate)
    const bDate = getTournamentStartDate(b.startDate)
    return aDate.getTime() - bDate.getTime()
  })[pastAndCurrentEvents.length - 1]
}

export function getTournamentType(
  event: TourEvent,
  currentDate: Date,
  mostRecentEvent: TourEvent | null
): 'live' | 'historical' | 'future' {
  // Always check for future tournaments first
  if (isFutureTournament(event, currentDate)) {
    return 'future'
  }

  // Only past/current tournaments can be live
  if (mostRecentEvent && event.eventId === mostRecentEvent.eventId) {
    return 'live'
  }

  return 'historical'
}

export function getEventHref(event: TourEvent, tournamentType: 'live' | 'historical' | 'future'): string {
  switch (tournamentType) {
    case 'live':
      return `/events/live-stats`
    case 'historical':
    case 'future':
      return `/events/${event.eventId}`
    default:
      return '/events'
  }
}

/**
 * Determines if a tournament should be displayed with transparency
 * Only historical tournaments are transparent
 */
export function isTransparent(startDate: string, currentDate: Date): boolean {
  // A tournament is transparent (historical) if it's not in the future and not the most recent
  const event = { startDate } // We only need startDate for isFutureTournament
  return !isFutureTournament(event as TourEvent, currentDate)
}

/**
 * Gets the current event to display based on the following priority:
 * 1. Most recent non-future tournament (live)
 * 2. Next upcoming tournament (future)
 * 3. Most recent historical tournament
 */
export function getCurrentEvent(events: TourEvent[], currentDate: Date): TourEvent | null {
  if (!events?.length) return null

  // First try to get the most recent non-future tournament
  const mostRecent = getMostRecentTournament(events, currentDate)
  if (mostRecent) return mostRecent

  // If no past/current tournaments, get the next future tournament
  const futureEvents = events.filter((event) => isFutureTournament(event, currentDate))
  if (futureEvents.length > 0) {
    return futureEvents.reduce((closest, event) => {
      const eventDate = getTournamentStartDate(event.startDate)
      const closestDate = getTournamentStartDate(closest.startDate)
      return eventDate < closestDate ? event : closest
    })
  }

  return null
}

/**
 * Gets the next upcoming tournament from a list of events
 * Returns the tournament with the earliest start date that is in the future
 */
export function getNextEvent(events: TourEvent[], currentDate: Date): TourEvent | null {
  const futureEvents = events.filter((event) => isFutureTournament(event, currentDate))
  if (!futureEvents.length) return null

  return futureEvents.sort((a, b) => {
    const aDate = getTournamentStartDate(a.startDate)
    const bDate = getTournamentStartDate(b.startDate)
    return aDate.getTime() - bDate.getTime()
  })[0]
}

export function processEvents(events: TourEvent[]): ProcessedTourEvent[] {
  const now = new Date()
  const mostRecentEvent = getMostRecentTournament(events, now)

  return events
    .map((event) => {
      const type = getTournamentType(event, now, mostRecentEvent)
      return {
        ...event,
        tournamentType: type,
        href: getEventHref(event, type),
        isComplete: type === 'historical'
      }
    })
    .sort((a, b) => sortEvents(a, b, now, mostRecentEvent))
}

function sortEvents(a: TourEvent, b: TourEvent, currentDate: Date, mostRecentEvent: TourEvent | null): number {
  const aType = getTournamentType(a, currentDate, mostRecentEvent)
  const bType = getTournamentType(b, currentDate, mostRecentEvent)

  // Most recent (live) event first
  if (aType === 'live') return -1
  if (bType === 'live') return 1

  // Then future events
  if (aType === 'future' && bType === 'historical') return -1
  if (bType === 'future' && aType === 'historical') return 1

  // For events of the same type, sort by start date
  const aStartDate = getTournamentStartDate(a.startDate)
  const bStartDate = getTournamentStartDate(b.startDate)
  return aStartDate.getTime() - bStartDate.getTime()
}
