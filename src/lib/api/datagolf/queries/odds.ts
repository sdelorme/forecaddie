import { dataGolfClient } from '../client'
import { DataGolfOdds } from '../types/odds'
import { normalizeOdds } from '../mappers/odds'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'

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
