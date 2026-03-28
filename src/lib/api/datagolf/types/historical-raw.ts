// Raw API response types (snake_case) for /historical-raw-data/* endpoints

export interface RawHistoricalRawEvent {
  calendar_year: number
  date: string
  event_id: number
  event_name: string
  sg_categories: string
  traditional_stats: string
  tour: string
}

export interface RawRoundData {
  score: number
  course_name: string
  course_par: number
  sg_total?: number | null
  sg_ott?: number | null
  sg_app?: number | null
  sg_arg?: number | null
  sg_putt?: number | null
  sg_t2g?: number | null
  driving_acc?: number | null
  driving_dist?: number | null
  gir?: number | null
  scrambling?: number | null
  birdies?: number | null
  bogies?: number | null
  pars?: number | null
  great_shots?: number | null
  poor_shots?: number | null
  prox_fw?: number | null
  prox_rgh?: number | null
  start_hole?: number | null
  teetime?: string | null
}

export interface RawHistoricalRawScore {
  dg_id: number
  player_name: string
  fin_text: string
  round_1?: RawRoundData | null
  round_2?: RawRoundData | null
  round_3?: RawRoundData | null
  round_4?: RawRoundData | null
}

export interface RawHistoricalRawRoundsResponse {
  event_name: string
  event_id: string
  tour: string
  event_completed: string
  year: number
  season: number
  sg_categories: string
  scores: RawHistoricalRawScore[]
}
