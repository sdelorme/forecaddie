import { LeaderboardPlayer } from '@/types/leaderboard'

export function formatLeaderboardPlayerName(
  player: Pick<LeaderboardPlayer, 'playerName'>
) {
  const [lastName, firstName] = player.playerName.split(', ')
  return `${firstName[0]}. ${lastName}`
}
