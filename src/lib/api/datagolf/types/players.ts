// Raw API response types (snake_case)
export interface RawPlayer {
  amateur: boolean
  country: string
  country_code: string
  dg_id: number
  player_name: string
}

export type RawPlayerListResponse = RawPlayer[]
