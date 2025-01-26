import { NextResponse } from 'next/server'
import { LiveEventStats } from '@/lib/types'

const LIVE_EVENT_URL = `https://feeds.datagolf.com/preds/live-tournament-stats?key=${process.env.DATA_GOLF_API_KEY}`

async function fetchLiveStats(): Promise<LiveEventStats> {
  const response = await fetch(LIVE_EVENT_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch live stats')
  }

  return response.json()
}

export async function GET() {
  try {
    const liveStats = await fetchLiveStats()
    return NextResponse.json(liveStats)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}
