import { Player } from './types'

const PLAYERS_URL = `https://feeds.datagolf.com/get-player-list?file_format=json&key=${process.env.DATA_GOLF_API_KEY}`

async function getPlayerList() {
  const response = await fetch(PLAYERS_URL)
  return response.json()
}

export default async function FetchPlayers() {
  const playerList = await getPlayerList()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {playerList.map((player: Player) => (
        <div key={player.dg_id} className="card">
          <h2>{formatPlayerName(player)}</h2>
          <p>{player.country}</p>
        </div>
      ))}
    </div>
  )
}

function formatPlayerName (player: Player) {
  const [lastName, firstName] = player.player_name.split(', ');
  return `${firstName} ${lastName}`;
};