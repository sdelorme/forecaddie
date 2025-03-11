export interface RawPlayer {
  amateur: number
  country: string
  country_code: string
  dg_id: number
  player_name: string
}

// Normalized types
export interface Player {
  amateur: number
  country: string
  countryCode: string
  dgId: number
  playerName: string
}

// The API returns an array directly
export type RawPlayerListResponse = RawPlayer[]
export type PlayerListResponse = Player[]
