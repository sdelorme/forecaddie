import type { RawLiveModel, RawLiveEventStats, RawLiveModelPlayer } from '../types/live-stats'
import type { Leaderboard, LeaderboardPlayer } from '@/types/leaderboard'
import { sortByResult } from '@/lib/utils/sort-results'

const NON_FINISH_POSITIONS = new Set(['CUT', 'MC', 'MDF', 'WD', 'DQ'])

const STATUS_FROM_POS: Record<string, string> = {
  CUT: 'cut',
  MC: 'cut',
  MDF: 'mdf',
  WD: 'wd',
  DQ: 'dq'
}

function formatScore(score: number | null | undefined): string {
  if (score == null) return '-'
  if (score === 0) return 'E'
  return score > 0 ? `+${score}` : `${score}`
}

function parsePosition(pos: string): number | null {
  const upper = pos.toUpperCase()
  if (NON_FINISH_POSITIONS.has(upper)) return null
  const num = upper.startsWith('T') ? parseInt(upper.slice(1)) : parseInt(upper)
  return isNaN(num) ? null : num
}

function parseScoreString(score: string): number | null {
  if (score === 'E') return 0
  if (score === '-') return null
  const n = parseInt(score, 10)
  return isNaN(n) ? null : n
}

function normalizeLiveModelPlayer(player: RawLiveModelPlayer): LeaderboardPlayer {
  return {
    dgId: player.dg_id,
    currentPosition: player.current_pos,
    currentScore: formatScore(player.current_score),
    r1: player.R1,
    r2: player.R2,
    r3: player.R3,
    r4: player.R4,
    playerName: player.player_name,
    round: player.round,
    thru: player.thru,
    today: formatScore(player.today),
    top10Odds: player.top_10,
    top20Odds: player.top_20,
    top5Odds: player.top_5,
    winOdds: player.win,
    isFavorite: false,
    isFlagged: false
  }
}

function sortPlayers(players: LeaderboardPlayer[]): LeaderboardPlayer[] {
  return sortByResult(players, {
    status: (p) => STATUS_FROM_POS[p.currentPosition.toUpperCase()] ?? 'finished',
    position: (p) => parsePosition(p.currentPosition),
    score: (p) => parseScoreString(p.currentScore),
    name: (p) => p.playerName
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
