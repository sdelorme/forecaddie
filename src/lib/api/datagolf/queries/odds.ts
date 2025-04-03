import { dataGolfClient } from '../client'
import { DataGolfOdds, NormalizedOddsData } from '../types/odds'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'

const normalizeOdds = (data: DataGolfOdds): NormalizedOddsData => {
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

export const getOutrightOdds = async () => {
  const data = await dataGolfClient<DataGolfOdds>(ENDPOINTS.OUTRIGHT_ODDS, {
    params: {
      market: 'win',
      odds_format: 'american'
    },
    revalidate: REVALIDATE_INTERVALS.ODDS,
    tags: [CACHE_TAGS.ODDS]
  })

  return normalizeOdds(data)
}
