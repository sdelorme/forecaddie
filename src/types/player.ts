export interface Player {
  amateur: boolean
  country: string
  countryCode: string
  dgId: number
  playerName: string
}

export type PlayerListResponse = Player[]
