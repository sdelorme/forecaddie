// Raw API response types (snake_case)
export interface RawLiveEventPlayer {
  dg_id: number
  player_name: string
  position: string
  round: number
  sg_app: number | null
  sg_arg: number | null
  sg_ott: number | null
  sg_putt: number | null
  sg_t2g: number | null
  sg_total: number | null
  thru: number
  total: number
}

export interface RawLiveEventStats {
  course_name: string
  event_name: string
  last_updated: string
  stat_display: string
  stat_round: string
  live_stats: RawLiveEventPlayer[]
}

export interface RawLiveModelPlayer {
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
  make_cut: number
  player_name: string
  round: number
  thru: number
  today: number
  top_10: number
  top_20: number
  top_5: number
  win: number
}

export interface RawLiveModelInfo {
  current_round: number
  dead_heat_rules: string
  event_name: string
  last_update: string
}

export interface RawLiveModel {
  data: RawLiveModelPlayer[]
  info: RawLiveModelInfo
}
