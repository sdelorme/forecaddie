import { TourEvent, ProcessedTourEvent } from '@/types/schedule'
import {
  getTournamentStartDate,
  getTournamentEndDate,
  isTournamentInProgress,
  isTournamentComplete
} from './tournament-time'

export function getTournamentType(event: TourEvent, currentDate: Date): 'live' | 'historical' | 'future' {
  const startDate = getTournamentStartDate(event.startDate)
  const endDate = getTournamentEndDate(event.startDate)

  if (isTournamentInProgress(event.startDate, currentDate)) {
    return 'live'
  }
  if (isTournamentComplete(event.startDate, currentDate)) {
    return 'historical'
  }
  return 'future'
}

export function getEventHref(event: TourEvent, tournamentType: 'live' | 'historical' | 'future'): string {
  switch (tournamentType) {
    case 'live':
      return `/events/live-stats`
    case 'historical':
      return `/events/${event.eventId}`
    case 'future':
      return `/events/future`
    default:
      return '/events'
  }
}

export function isTransparent(startDate: string, currentDate: Date): boolean {
  return isTournamentComplete(startDate, currentDate)
}

export function getCurrentEvent(events: TourEvent[], currentDate: Date): TourEvent | null {
  if (!events?.length) return null

  const liveEvent = events.find((event) => getTournamentType(event, currentDate) === 'live')
  if (liveEvent) return liveEvent

  const futureEvents = events.filter((event) => getTournamentType(event, currentDate) === 'future')
  if (futureEvents.length > 0) {
    return futureEvents.reduce((closest, event) => {
      const eventDate = getTournamentStartDate(event.startDate)
      const closestDate = getTournamentStartDate(closest.startDate)
      return eventDate < closestDate ? event : closest
    })
  }

  const historicalEvents = events.filter((event) => getTournamentType(event, currentDate) === 'historical')
  if (historicalEvents.length > 0) {
    return historicalEvents.reduce((latest, event) => {
      const eventDate = getTournamentStartDate(event.startDate)
      const latestDate = getTournamentStartDate(latest.startDate)
      return eventDate > latestDate ? event : latest
    })
  }

  return null
}

export function processEvents(events: TourEvent[]): ProcessedTourEvent[] {
  const now = new Date()
  return events
    .map((event) => {
      const type = getTournamentType(event, now)
      return {
        ...event,
        tournamentType: type,
        href: getEventHref(event, type),
        isComplete: isTournamentComplete(event.startDate, now)
      }
    })
    .sort(sortEvents)
}

function sortEvents(a: TourEvent, b: TourEvent): number {
  const now = new Date()
  const aType = getTournamentType(a, now)
  const bType = getTournamentType(b, now)

  // Live events should appear first
  if (aType === 'live' && bType !== 'live') return -1
  if (bType === 'live' && aType !== 'live') return 1

  // Then upcoming events
  if (aType === 'future' && bType === 'historical') return -1
  if (bType === 'future' && aType === 'historical') return 1

  // For events of the same type, sort by start date
  const aStartDate = getTournamentStartDate(a.startDate)
  const bStartDate = getTournamentStartDate(b.startDate)
  return aStartDate.getTime() - bStartDate.getTime()
}
