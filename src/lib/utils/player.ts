import type { LeaderboardPlayer } from '@/types/leaderboard'
import type { Player } from '@/types/player'
import { RawPlayer } from '../api/datagolf'

export function formatPlayerName(playerName: string): string {
  const parts = playerName.split(', ')
  if (parts.length < 2) return playerName
  return `${parts[1]} ${parts[0]}`
}

export function formatShortName(name: string): string {
  if (name.includes(', ')) {
    const [lastName, firstName] = name.split(', ')
    return `${firstName[0]}. ${lastName}`
  }
  const parts = name.split(' ')
  if (parts.length < 2) return name
  return `${parts[0][0]}. ${parts.slice(1).join(' ')}`
}

export function formatLeaderboardPlayerName(player: Pick<LeaderboardPlayer, 'playerName'>) {
  return formatShortName(player.playerName)
}

export function formatPlayerListName(player: Pick<RawPlayer, 'player_name'>) {
  return formatPlayerName(player.player_name)
}

export function getLastName(player_name: string) {
  return player_name.split(', ')[0]
}

export function getFirstLetterOfLastName(player_name: string) {
  return getLastName(player_name).charAt(0).toUpperCase()
}
