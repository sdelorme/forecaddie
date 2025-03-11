import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { mapToLeaderboard } from '../mappers/leaderboard'
import type { LiveModelPlayerResponse, LiveEventStatsResponse } from '@/types/live-events'
import type { Leaderboard } from '@/types/leaderboard'

export async function getLiveLeaderboard(): Promise<Leaderboard> {
  try {
    const [liveModel, liveEventStats] = await Promise.all([
      dataGolfClient<LiveModelPlayerResponse>(ENDPOINTS.LIVE_PREDICTIONS, {
        revalidate: REVALIDATE_INTERVALS.LIVE_ACTIVE,
        tags: [CACHE_TAGS.LIVE]
      }),
      dataGolfClient<LiveEventStatsResponse>(ENDPOINTS.LIVE_STATS, {
        revalidate: REVALIDATE_INTERVALS.LIVE_ACTIVE,
        tags: [CACHE_TAGS.LIVE]
      })
    ])

    return mapToLeaderboard(liveModel, liveEventStats)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return {
      players: [],
      eventInfo: {
        eventName: 'No Active Tournament',
        course: 'N/A',
        lastUpdated: new Date().toISOString(),
        currentRound: null
      }
    }
  }
}
