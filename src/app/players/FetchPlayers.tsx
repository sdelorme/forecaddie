async function getPlayerList() {
  const response = await fetch(
    `https://feeds.datagolf.com/get-player-list?file_format=json&key=${process.env.DATA_GOLF_API_KEY}`
  )
  return response.json()
}

export default function FetchPlayers() {
  return <div>FetchPlayers</div>
}
