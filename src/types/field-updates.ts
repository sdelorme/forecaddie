// Domain types for field updates (camelCase)

export type Wave = 'early' | 'late' | null

export interface FieldPlayer {
  dgId: number
  playerName: string
  country: string
  teeTime: string | null
  startHole: number | null
  wave: Wave
  isAmateur: boolean
}

export interface FieldUpdate {
  courseName: string
  currentRound: number
  eventName: string
  players: FieldPlayer[]
}
