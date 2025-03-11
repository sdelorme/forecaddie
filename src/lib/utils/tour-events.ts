import { TourEvent, ProcessedTourEvent } from '@/types/schedule'

export function getTournamentType(event: TourEvent, currentDate: Date): 'live' | 'historical' | 'future' {
  const startDate = new Date(event.startDate)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 4)
  endDate.setHours(23, 59, 59, 999)

  if (currentDate >= startDate && currentDate <= endDate) {
    return 'live'
  }
  if (currentDate > endDate) {
    return 'historical'
  }
  return 'future'
}

export function getEventHref(event: TourEvent, tournamentType: string): string {
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
  const eventDate = new Date(startDate)
  return currentDate > new Date(eventDate.setDate(eventDate.getDate() + 5))
}

export function getCurrentEvent(events: TourEvent[], currentDate: Date): TourEvent | null {
  if (!events?.length) return null

  const liveEvent = events.find((event) => getTournamentType(event, currentDate) === 'live')
  if (liveEvent) return liveEvent

  const futureEvents = events.filter((event) => getTournamentType(event, currentDate) === 'future')
  if (futureEvents.length > 0) {
    return futureEvents.reduce((closest, event) => {
      const eventDate = new Date(event.startDate)
      const closestDate = new Date(closest.startDate)
      return eventDate < closestDate ? event : closest
    })
  }

  const historicalEvents = events.filter((event) => getTournamentType(event, currentDate) === 'historical')
  if (historicalEvents.length > 0) {
    return historicalEvents.reduce((latest, event) => {
      const eventDate = new Date(event.startDate)
      const latestDate = new Date(latest.startDate)
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
        isComplete: isEventCompleted(event.startDate, now)
      }
    })
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

function sortEvents(a: TourEvent, b: TourEvent): number {
  const now = new Date()
  const aStartDate = new Date(a.startDate)
  const bStartDate = new Date(b.startDate)
  const aEndDate = getEventEndDate(a.startDate)
  const bEndDate = getEventEndDate(b.startDate)

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
