export interface Event {
  course: string
  course_key: string
  event_id: number
  event_name: string
  latitude: number
  location: string
  longitude: number
  start_date: string
}

export interface TourSchedule {
  tour: string
  current_season: number
  schedule: Event[]
}
