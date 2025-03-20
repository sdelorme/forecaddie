// Application types (normalized)
export interface TourEvent {
  course: string
  courseKey: string
  eventId: number
  eventName: string
  latitude: number
  location: string
  longitude: number
  startDate: string
}

export interface ProcessedTourEvent extends TourEvent {
  tournamentType: 'live' | 'historical' | 'future'
  href: string
  isComplete: boolean
}

export interface TourSchedule {
  tour: string
  currentSeason: number
  schedule: TourEvent[]
}
