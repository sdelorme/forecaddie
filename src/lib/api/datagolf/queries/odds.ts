import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { DataGolfOddsSchema } from '../schemas/odds'
import type { DataGolfOdds, NormalizedOddsData } from '../types/odds'

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
      datagolfBaselineHistoryFit: player.datagolf.baseline_history_fit ?? ''
    }))
  }
}

const emptyOddsData: NormalizedOddsData = {
  eventName: '',
  lastUpdated: '',
  players: []
}

export async function getOutrightOdds(): Promise<NormalizedOddsData> {
  try {
    const response = await dataGolfClient<unknown>(ENDPOINTS.OUTRIGHT_ODDS, {
      params: {
        market: 'win',
        odds_format: 'american'
      },
      revalidate: REVALIDATE_INTERVALS.ODDS,
      tags: [CACHE_TAGS.ODDS]
    })

    const parsed = DataGolfOddsSchema.safeParse(response)
    if (!parsed.success) {
      console.error('Invalid odds response:', parsed.error.format())
      return emptyOddsData
    }

    return normalizeOdds(parsed.data)
  } catch (error) {
    console.error('Error fetching outright odds:', error)
    return emptyOddsData
  }
}
