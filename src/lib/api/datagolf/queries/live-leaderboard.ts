import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { RawLiveModelSchema, RawLiveEventStatsSchema } from '../schemas/live-stats'
import type { Leaderboard } from '@/types/leaderboard'
import { mapToLeaderboard } from '../mappers/leaderboard'

const emptyLeaderboard: Leaderboard = {
  players: [],
  eventInfo: {
    eventName: '',
    course: '',
    lastUpdated: '',
    currentRound: null
  }
}

export async function getLiveLeaderboard(): Promise<Leaderboard> {
  try {
    const [liveModelResponse, liveEventStatsResponse] = await Promise.all([
      dataGolfClient<unknown>(ENDPOINTS.LIVE_PREDICTIONS, {
        revalidate: REVALIDATE_INTERVALS.LIVE_ACTIVE,
        tags: [CACHE_TAGS.LIVE],
        params: {
          file_format: 'json'
        }
      }),
      dataGolfClient<unknown>(ENDPOINTS.LIVE_STATS, {
        revalidate: REVALIDATE_INTERVALS.LIVE_ACTIVE,
        tags: [CACHE_TAGS.LIVE],
        params: {
          file_format: 'json'
        }
      })
    ])

    const liveModelParsed = RawLiveModelSchema.safeParse(liveModelResponse)
    if (!liveModelParsed.success) {
      console.error('Invalid live model response:', liveModelParsed.error.format())
      return emptyLeaderboard
    }

    const liveEventStatsParsed = RawLiveEventStatsSchema.safeParse(liveEventStatsResponse)
    if (!liveEventStatsParsed.success) {
      console.error('Invalid live event stats response:', liveEventStatsParsed.error.format())
      return emptyLeaderboard
    }

    return mapToLeaderboard(liveModelParsed.data, liveEventStatsParsed.data)
  } catch (error) {
    console.error('Error fetching live leaderboard:', error)
    return emptyLeaderboard
  }
}
