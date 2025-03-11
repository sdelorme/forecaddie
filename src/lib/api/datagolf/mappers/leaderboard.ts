import type { LiveModelPlayerResponse, LiveEventStatsResponse } from '@/types/live-events'
import type { Leaderboard } from '@/types/leaderboard'
import { compareScores, formatPlayerScore, formatPlayerThru, decimalToPercent } from '@/lib/utils/live-stats-helpers'

export function mapToLeaderboard(
  liveModel: LiveModelPlayerResponse,
  liveEventStats: LiveEventStatsResponse
): Leaderboard {
  const { data, info } = liveModel

  const leaderboardPlayers = data
    .sort((a, b) => compareScores(a.currentScore, b.currentScore))
    .map((player) => ({
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
      isFlagged: false
    }))

  return {
    players: leaderboardPlayers,
    eventInfo: {
      eventName: liveEventStats.eventName,
      course: liveEventStats.courseName,
      lastUpdated: liveEventStats.lastUpdated,
      currentRound: info.currentRound
    }
  }
}
