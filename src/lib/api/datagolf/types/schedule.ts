// Raw API response types (snake_case)
export interface RawTourEvent {
  country: string
  course: string
  course_key: string
  event_id: string
  event_name: string
  latitude: number
  location: string
  longitude: number
  start_date: string
  status: 'upcoming' | 'in_progress' | 'completed'
  tour: string
  winner: string
}

export interface RawTourSchedule {
  tour: string
  season: number
  schedule: RawTourEvent[]
}
