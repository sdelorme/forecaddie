export interface LiveEventPlayer {
  dgId: number
  playerName: string
  position: string
  round: number // this is their score for the round
  sgApp: number | null
  sgArg: number | null
  sgOtt: number | null
  sgPutt: number | null
  sgT2g: number | null
  sgTotal: number | null
  thru: number
  total: number // total score for the tournament
}
export interface LiveEventStatsResponse {
  courseName: string
  eventName: string
  lastUpdated: string
  statDisplay: string
  statRound: string
  liveStats: LiveEventPlayer[]
}

export interface LiveModelPlayer {
  R1: number | null
  R2: number | null
  R3: number | null
  R4: number | null
  country: string
  course: string
  currentPos: string
  currentScore: number | null
  dgId: number
  endHole: number
  makeCut: number // binary 1 = yes 0 = no
  playerName: string
  round: number
  thru: number
  today: number
  top10: number // ex./ 0.946025
  top20: number
  top5: number
  win: number
}

export type LiveModelPlayerResponse = {
  data: LiveModelPlayer[]
  info: {
    currentRound: number
    deadHeatRules: string
    eventName: string
    lastUpdate: string
  }
}
