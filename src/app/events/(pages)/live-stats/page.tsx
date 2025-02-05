import LiveTournamentStats from "../../(components)/live-tournament-stats"


const LiveEventPage = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/live/live-stats`,
    { cache: 'no-store' }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch live event stats')
  }

  const liveStats = await response.json()

  return <LiveTournamentStats {...liveStats} />
}

export default LiveEventPage
