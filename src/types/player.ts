export interface Player {
  amateur: number
  country: string
  countryCode: string
  dgId: number
  playerName: string
  displayName: string
  firstLetter: string
}

export type PlayerListResponse = Player[]
