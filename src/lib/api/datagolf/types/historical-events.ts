// Raw API response types (snake_case) for historical event data

export interface RawHistoricalEvent {
  calendar_year: number
  date: string
  event_id: number
  event_name: string
  tour: string
}

export interface RawHistoricalEventResult {
  dg_id: number
  player_name: string
  fin_text: string
  earnings?: number | null
  fec_points?: number | null
  dg_points?: number | null
}

export interface RawHistoricalEventResultsResponse {
  event_completed: string
  tour: string
  season: number
  year: number
  event_name: string
  event_id: string
  event_stats: RawHistoricalEventResult[]
}
