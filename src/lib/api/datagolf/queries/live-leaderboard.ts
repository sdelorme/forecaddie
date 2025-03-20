import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import type { RawLiveModel, RawLiveEventStats } from '../types/live-stats'
import type { Leaderboard } from '@/types/leaderboard'
import { mapToLeaderboard } from '../mappers/leaderboard'

export async function getLiveLeaderboard(): Promise<Leaderboard> {
  try {
    const liveModel = await dataGolfClient<RawLiveModel>(ENDPOINTS.LIVE_PREDICTIONS, {
      revalidate: REVALIDATE_INTERVALS.LIVE_ACTIVE,
      tags: [CACHE_TAGS.LIVE],
      params: {
        file_format: 'json'
      }
    })

    const liveEventStats = await dataGolfClient<RawLiveEventStats>(ENDPOINTS.LIVE_STATS, {
      revalidate: REVALIDATE_INTERVALS.LIVE_ACTIVE,
      tags: [CACHE_TAGS.LIVE],
      params: {
        file_format: 'json'
      }
    })

    return mapToLeaderboard(liveModel, liveEventStats)
  } catch (error) {
    console.error('Error fetching live leaderboard:', error)
    return {
      players: [],
      eventInfo: {
        eventName: '',
        course: '',
        lastUpdated: '',
        currentRound: null
      }
    }
  }
}
