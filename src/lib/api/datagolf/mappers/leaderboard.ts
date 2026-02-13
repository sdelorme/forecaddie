import type { RawLiveModel, RawLiveEventStats, RawLiveModelPlayer } from '../types/live-stats'
import type { Leaderboard, LeaderboardPlayer } from '@/types/leaderboard'

function normalizeLiveModelPlayer(player: RawLiveModelPlayer): LeaderboardPlayer {
  return {
    dgId: player.dg_id,
    currentPosition: player.current_pos,
    currentScore: player.current_score?.toString() || '-',
    r1: player.R1,
    r2: player.R2,
    r3: player.R3,
    r4: player.R4,
    playerName: player.player_name,
    round: player.round,
    thru: player.thru,
    today: player.today,
    top10Odds: player.top_10,
    top20Odds: player.top_20,
    top5Odds: player.top_5,
    winOdds: player.win,
    isFavorite: false,
    isFlagged: false
  }
}

/**
 * Converts position string to a number for sorting
 * CUT players are sorted to the end
 * T positions (e.g. T4) are converted to their numeric value
 */
function getPositionValue(position: string): number {
  if (position === 'CUT') return Number.MAX_SAFE_INTEGER // Sort CUT players to the end
  if (position.startsWith('T')) return parseInt(position.slice(1)) // Handle T positions
  return parseInt(position)
}

/**
 * Sorts players by position and first name
 */
function sortPlayers(players: LeaderboardPlayer[]): LeaderboardPlayer[] {
  return [...players].sort((a, b) => {
    const posA = getPositionValue(a.currentPosition)
    const posB = getPositionValue(b.currentPosition)

    // First sort by position
    if (posA !== posB) {
      return posA - posB
    }

    // If positions are equal, sort by last name
    const nameA = a.playerName.split(', ')[0]
    const nameB = b.playerName.split(', ')[0]
    return nameA.localeCompare(nameB)
  })
}

export function mapToLeaderboard(liveModel: RawLiveModel, liveEventStats: RawLiveEventStats): Leaderboard {
  const players = liveModel.data.map(normalizeLiveModelPlayer)
  const sortedPlayers = sortPlayers(players)

  return {
    players: sortedPlayers,
    eventInfo: {
      eventName: liveModel.info.event_name,
      course: liveEventStats.course_name,
      lastUpdated: liveModel.info.last_update,
      currentRound: liveModel.info.current_round
    }
  }
}
