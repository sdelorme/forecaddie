// Application types (normalized)
export interface TourEvent {
  country: string
  course: string
  courseKey: string
  eventId: string
  eventName: string
  latitude: number
  location: string
  longitude: number
  startDate: string
  status: 'upcoming' | 'in_progress' | 'completed'
  winner: string
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
