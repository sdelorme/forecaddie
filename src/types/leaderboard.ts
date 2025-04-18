export type LeaderboardPlayer = {
  dgId: number
  currentPosition: string
  currentScore: string
  r1: number | null
  r2: number | null
  r3: number | null
  r4: number | null
  playerName: string
  round: number
  thru: string
  today: number
  top10Odds: number
  top20Odds: number
  top5Odds: number
  winOdds: number
  isFavorite: boolean
  isFlagged: boolean
}

export interface LeaderboardEvent {
  eventName: string
  course: string
  lastUpdated: string
  currentRound: number | null
}

export type Leaderboard = {
  players: LeaderboardPlayer[]
  eventInfo: LeaderboardEvent
}
