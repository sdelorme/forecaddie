export type RawDgRanking = {
  dg_id: number
  player_name: string
  [key: string]: unknown
}

export type RawDgRankingsResponse = {
  rankings: RawDgRanking[]
  [key: string]: unknown
}

export type RawSkillRating = {
  dg_id: number
  player_name: string
  [key: string]: unknown
}

export type RawSkillRatingsResponse = {
  players: RawSkillRating[]
  [key: string]: unknown
}

export type RawEventResult = {
  dg_id: number
  [key: string]: unknown
}

export type RawEventListItem = {
  event_id: number
  [key: string]: unknown
}
