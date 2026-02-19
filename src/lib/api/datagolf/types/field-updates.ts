// Raw API response types (snake_case) for /field-updates endpoint

export interface RawFieldPlayer {
  am: number
  country: string
  dg_id: number
  dk_id?: string | null
  dk_salary?: number | null
  early_late?: number | null
  fd_id?: string | null
  fd_salary?: number | null
  player_name: string
  r1_teetime?: string | null
  start_hole?: number | null
}

export interface RawFieldUpdatesResponse {
  course_name: string
  current_round: number
  event_name: string
  field: RawFieldPlayer[]
}
