import { Player } from '@/types/player'

export function formatPlayerNameDesktop(player: Pick<Player, 'player_name'>) {
  const [lastName, firstName] = player.player_name.split(', ')
  return `${firstName} ${lastName}`
}

export function formatPlayerNameMobile(player: Pick<Player, 'player_name'>) {
  const [lastName, firstName] = player.player_name.split(', ')
  return `${firstName[0]}. ${lastName}`
}
