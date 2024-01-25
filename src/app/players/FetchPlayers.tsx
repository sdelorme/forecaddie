import { Player } from './types'

const PLAYERS_URL = `https://feeds.datagolf.com/get-player-list?file_format=json&key=${process.env.DATA_GOLF_API_KEY}`

async function getPlayerList() {
  const response = await fetch(PLAYERS_URL)
  return response.json()
}

export default async function FetchPlayers() {
  const playerList = await getPlayerList()
  return (
    <div>
      {playerList.map((player: Player) => (
        <div key={player.dg_id} className="card">
          <h2>{player.player_name}</h2>
          <p>{player.country}</p>
        </div>
      ))}
    </div>
  )
}
