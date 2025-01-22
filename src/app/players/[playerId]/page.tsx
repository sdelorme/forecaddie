import { Player } from "../types"

export default function PlayerDetails({ player }: {player: Player}) {
const playerId = player.dg_id
  return (
    <div>{playerId}</div>
  )
}
