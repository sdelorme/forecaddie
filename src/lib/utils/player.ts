import { Player } from '../types'

export function formatPlayerName(player: Pick<Player, 'player_name'>) {
  const [lastName, firstName] = player.player_name.split(', ') // Access the `player_name` string
  return `${firstName} ${lastName}`
}
