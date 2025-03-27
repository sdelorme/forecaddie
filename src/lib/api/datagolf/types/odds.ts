export interface DataGolfOdds {
  books_offering: string[]
  event_name: string
  last_updated: string
  market: string
  odds: PlayerOdds[]
}

export interface PlayerOdds {
  bet365?: string
  betcris?: string
  betfair?: string
  betonline?: string
  betmgm?: string
  betway?: string
  bovada?: string
  caesars?: string
  datagolf: {
    baseline: string
    baseline_history_fit: string
  }
  dg_id: number
  draftkings?: string
  fanduel?: string
  pinnacle?: string
  player_name: string
  pointsbet?: string
  skybet?: string
  unibet?: string
  williamhill?: string
}

export interface NormalizedPlayerOdds {
  playerName: string
  dgId: number
  fanduel: string
  draftkings: string
  betmgm: string
  datagolfBaselineHistoryFit: string
}

export interface NormalizedOddsData {
  eventName: string
  lastUpdated: string
  players: NormalizedPlayerOdds[]
}
