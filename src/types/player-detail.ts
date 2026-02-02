export type PlayerProfile = {
  dgId: number
  playerName: string
  country?: string
  countryCode?: string
  amateur?: number
}

export type PlayerRanking = {
  label: string
  value: string | number
}

export type PlayerTournamentResult = {
  eventName: string
  year?: number
  finishPosition?: number | null
  earnings?: number | null
}

export type PlayerDetail = {
  profile: PlayerProfile | null
  rankings: PlayerRanking[]
  tournamentHistory: PlayerTournamentResult[]
}
