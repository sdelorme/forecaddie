export interface TourEvent {
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
  schedule: TourEvent[]
}

export interface LiveEventPlayerStats {
  dg_id: number
  player_name: string
  position: string
  round: number // this is their score for the round
  sg_app: number | null
  sg_arg: number | null
  sg_ott: number | null
  sg_putt: number | null
  sg_t2g: number | null
  sg_total: number | null
  thru: number
  total: number // total score for the tournament
}
export interface LiveEventStats {
  course_name: string
  event_name: string
  last_updated: string
  live_stats: LiveEventPlayerStats[]
  stat_display: string
  stat_round: string
}

export type Player = {
  amateur: number
  country: string
  country_code: string
  dg_id: number
  player_name: string
}

export type PlayerList = Player[]
