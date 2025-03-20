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
  schedule: RawTourEvent[]
}
