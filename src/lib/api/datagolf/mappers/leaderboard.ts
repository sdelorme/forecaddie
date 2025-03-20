import type { RawLiveModel, RawLiveEventStats, RawLiveModelPlayer } from '../types/live-stats'
import type { Leaderboard } from '@/types/leaderboard'

function normalizeLiveModelPlayer(player: RawLiveModelPlayer) {
  return {
    dgId: player.dg_id,
    currentPosition: player.current_pos,
    currentScore: player.current_score?.toString() || '-',
    r1: player.r1,
    r2: player.r2,
    r3: player.r3,
    r4: player.r4,
    playerName: player.player_name,
    round: player.round,
    thru: player.thru.toString(),
    today: player.today,
    top10Odds: player.top_10,
    top20Odds: player.top_20,
    top5Odds: player.top_5,
    winOdds: player.win,
    isFavorite: false,
    isFlagged: false
  }
}

export function mapToLeaderboard(liveModel: RawLiveModel, liveEventStats: RawLiveEventStats): Leaderboard {
  return {
    players: liveModel.data.map(normalizeLiveModelPlayer),
    eventInfo: {
      eventName: liveModel.info.event_name,
      course: liveEventStats.course_name,
      lastUpdated: liveModel.info.last_update,
      currentRound: liveModel.info.current_round
    }
  }
}
