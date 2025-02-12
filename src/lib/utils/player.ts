import { Player } from '@/types/player'

export function formatLeaderboardPlayerName(
  player: Pick<Player, 'player_name'>
) {
  const [lastName, firstName] = player.player_name.split(', ')
  return `${firstName[0]}. ${lastName}`
}
