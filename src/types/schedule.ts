// Raw API response types (snake_case)
export interface RawTourEvent {
  course: string
  course_key: string
  event_id: number
  event_name: string
  latitude: number
  location: string
  longitude: number
  start_date: string
}

export interface RawTourSchedule {
  tour: string
  current_season: number
  schedule: RawTourEvent[]
}

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
