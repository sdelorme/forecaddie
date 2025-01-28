import { TourEvent } from '@/types/schedule'
import moment from 'moment'

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

export function isTransparent(
  startDate: string,
  currentDate: moment.Moment
): boolean {
  const eventDate = moment.utc(startDate, 'YYYY-MM-DD')
  return currentDate.isAfter(eventDate.add(5, 'days'))
}
