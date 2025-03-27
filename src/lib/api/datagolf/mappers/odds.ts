import { DataGolfOdds, NormalizedOddsData } from '../types/odds'

export const normalizeOdds = (data: DataGolfOdds): NormalizedOddsData => {
  return {
    eventName: data.event_name,
    lastUpdated: data.last_updated,
    players: data.odds.map((player) => ({
      playerName: player.player_name,
      dgId: player.dg_id,
      fanduel: player.fanduel || '',
      draftkings: player.draftkings || '',
      betmgm: player.betmgm || '',
      datagolfBaselineHistoryFit: player.datagolf.baseline_history_fit
    }))
  }
}
