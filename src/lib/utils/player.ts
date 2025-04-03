import type { LeaderboardPlayer } from '@/types/leaderboard'
import type { Player } from '@/types/player'
import { RawPlayer } from '../api/datagolf'

export function formatLeaderboardPlayerName(player: Pick<LeaderboardPlayer, 'playerName'>) {
  const [lastName, firstName] = player.playerName.split(', ')
  return `${firstName[0]}. ${lastName}`
}

export function formatPlayerListName(player: Pick<RawPlayer, 'player_name'>) {
  const [lastName, firstName] = player.player_name.split(', ')
  return `${firstName} ${lastName}`
}

export function getLastName(player_name: string) {
  return player_name.split(', ')[0]
}

export function getFirstLetterOfLastName(player_name: string) {
  return getLastName(player_name).charAt(0).toUpperCase()
}
