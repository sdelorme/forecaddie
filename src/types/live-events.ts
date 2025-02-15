export interface LiveEventPlayer {
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
export interface LiveEventStatsResponse {
  course_name: string
  event_name: string
  last_updated: string
  stat_display: string
  stat_round: string
  live_stats: LiveEventPlayer[]
}

export interface LiveModelPlayer {
  R1: number | null
  R2: number | null
  R3: number | null
  R4: number | null
  country: string
  course: string
  current_pos: string
  current_score: number | null
  dg_id: number
  end_hole: number
  make_cut: number // binary 1 = yes 0 = no
  player_name: string
  round: number
  thru: number
  today: number
  top_10: number // ex./ 0.946025
  top_20: number
  top_5: number
  win: number
}

export type LiveModelPlayerResponse = {
  data: LiveModelPlayer[]
  info: {
    current_round: number
    dead_heat_rules: string
    event_name: string
    last_update: string
  }
}
