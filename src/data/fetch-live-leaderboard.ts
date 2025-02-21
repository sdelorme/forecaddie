import {
  compareScores,
  decimalToPercent,
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

    const { data, info } = liveModel

    const leaderboardPlayers: LeaderboardPlayer[] = data
      .sort((a: LiveModelPlayer, b: LiveModelPlayer) => {
        return (
          compareScores(a.currentScore, b.currentScore) ||
          a.playerName.localeCompare(b.playerName)
        )
      })
      .map((player: LiveModelPlayer) => ({
        dgId: player.dgId,
        currentPosition: player.currentPos,
        currentScore: formatPlayerScore(player.currentScore),
        r1: player.R1,
        r2: player.R2,
        r3: player.R3,
        r4: player.R4,
        playerName: player.playerName,
        round: player.round,
        thru: formatPlayerThru(player.thru),
        today: player.today,
        top10Odds: decimalToPercent(player.top10),
        top20Odds: decimalToPercent(player.top20),
        top5Odds: decimalToPercent(player.top5),
        winOdds: decimalToPercent(player.win),
        isFavorite: false,
        isFlagged: false,
      }))

    const leaderboardEvent: LeaderboardEvent = {
      eventName: liveEventStats.eventName,
      course: liveEventStats.courseName,
      lastUpdated: liveEventStats.lastUpdated,
      currentRound: info.currentRound,
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
        currentRound: null,
      },
    }
  }
}
