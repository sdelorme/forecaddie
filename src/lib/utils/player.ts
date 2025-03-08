import type { LeaderboardPlayer } from '@/types/leaderboard'
import type { Player } from '@/types/player'

export function formatLeaderboardPlayerName(player: Pick<LeaderboardPlayer, 'playerName'>) {
  if (!player?.playerName) return ''
  const [lastName, firstName] = player.playerName.split(', ')
  if (!lastName || !firstName) return player.playerName
  return `${firstName[0]}. ${lastName}`
}

export function formatPlayerListName(player: Pick<Player, 'playerName'>) {
  if (!player?.playerName) return ''
  const [lastName, firstName] = player.playerName.split(', ')
  if (!lastName || !firstName) return player.playerName
  return `${firstName} ${lastName}`
}

export function getLastName(playerName: string) {
  if (!playerName) return ''
  const parts = playerName.split(', ')
  return parts[0] || playerName
}

export function getFirstLetterOfLastName(playerName: string) {
  if (!playerName) return ''
  const lastName = getLastName(playerName)
  return lastName.charAt(0).toUpperCase()
}
