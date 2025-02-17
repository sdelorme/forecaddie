import {
  compareScores,
  formatPlayerScore,
  formatPlayerThru,
} from '@/lib/utils/live-stats-helpers'
import type {
  Leaderboard,
  LeaderboardPlayer,
  LeaderboardEvent,
} from '@/types/leaderboard'
import type {
  LiveModelPlayer,
  LiveModelPlayerResponse,
} from '@/types/live-events'
import type { LiveEventStatsResponse } from '@/types/live-events'

export async function getLiveLeaderboard(): Promise<Leaderboard> {
  try {
    const [playersResponse, eventResponse] = await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/live/live-prediction-model`,
        {
          next: { revalidate: 330 },
        }
      ),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/live/live-stats`, {
        next: { revalidate: 330 },
      }),
    ])

    if (!playersResponse.ok || !eventResponse.ok) {
      throw new Error('Failed to fetch live stats')
    }

    const liveModel: LiveModelPlayerResponse = await playersResponse.json()
    const liveEventStats: LiveEventStatsResponse = await eventResponse.json()

    const leaderboardPlayers: LeaderboardPlayer[] = liveModel.data
      .sort((a: LiveModelPlayer, b: LiveModelPlayer) => {
        return (
          compareScores(a.current_score, b.current_score) ||
          a.player_name.localeCompare(b.player_name)
        )
      })
      .map((player: LiveModelPlayer) => ({
        dgId: player.dg_id,
        currentPosition: player.current_pos,
        currentScore: formatPlayerScore(player.current_score),
        r1: player.R1,
        r2: player.R2,
        r3: player.R3,
        r4: player.R4,
        playerName: player.player_name,
        round: player.round,
        thru: formatPlayerThru(player.thru),
        today: player.today,
        top10Odds: player.top_10,
        top20Odds: player.top_20,
        top5Odds: player.top_5,
        winOdds: player.win,
        isFavorite: false,
        isFlagged: false,
      }))

    const leaderboardEvent: LeaderboardEvent = {
      eventName: liveEventStats.event_name,
      course: liveEventStats.course_name,
      lastUpdated: liveEventStats.last_updated,
    }

    return {
      players: leaderboardPlayers,
      eventInfo: leaderboardEvent,
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return {
      players: [],
      eventInfo: {
        eventName: 'No Active Tournament',
        course: 'N/A',
        lastUpdated: new Date().toISOString(),
      },
    }
  }
}
