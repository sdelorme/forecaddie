import { LiveEventStats } from '../types'
import LiveTournamentStats from './FetchLiveEventStats'

const LIVE_EVENT_URL = `https://feeds.datagolf.com/preds/live-tournament-stats?key=${process.env.DATA_GOLF_API_KEY}`

async function getLiveStats(): Promise<LiveEventStats> {
  const response = await fetch(LIVE_EVENT_URL, { next: { revalidate: 300 } }) // Revalidate every 5 minutes
  if (!response.ok) {
    throw new Error('Failed to fetch live stats')
  }
  return response.json()
}

const LiveEventPage = async () => {
  const liveStats = await getLiveStats()

  return <LiveTournamentStats {...liveStats} />
}

export default LiveEventPage
