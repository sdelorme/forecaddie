import type { LeaderboardPlayer } from '@/types/leaderboard'
import type { Player } from '@/types/player'

export function formatLeaderboardPlayerName(player: Pick<LeaderboardPlayer, 'playerName'>) {
  const [lastName, firstName] = player.playerName.split(', ')
  return `${firstName[0]}. ${lastName}`
}

export function formatPlayerListName(player: Pick<Player, 'playerName'>) {
  const [lastName, firstName] = player.playerName.split(', ')
  return `${firstName} ${lastName}`
}

export function getLastName(playerName: string) {
  return playerName.split(', ')[0]
}

export function getFirstLetterOfLastName(playerName: string) {
  return getLastName(playerName).charAt(0).toUpperCase()
}
