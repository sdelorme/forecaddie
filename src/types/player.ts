export interface RawPlayer {
  amateur: number
  country: string
  country_code: string
  dg_id: number
  player_name: string
}

export interface Player {
  amateur: number
  country: string
  countryCode: string
  dgId: number
  playerName: string
}

export type RawPlayerListResponse = RawPlayer[]
export type PlayerListResponse = Player[]
