import { NextResponse } from 'next/server'
import { LiveEventStats } from '@/types/live-events'

const LIVE_EVENT_URL = `https://feeds.datagolf.com/preds/live-tournament-stats?key=${process.env.DATA_GOLF_API_KEY}`

async function fetchLiveStats(): Promise<LiveEventStats> {
  console.log('Fetching from DataGolf:', LIVE_EVENT_URL)
  const response = await fetch(LIVE_EVENT_URL)

  if (!response.ok) {
    console.error('DataGolf API error:', response.status, response.statusText)
    throw new Error('Failed to fetch live stats')
  }

  const data = await response.json()
  console.log('DataGolf API response:', data)
  return data
}

export async function GET() {
  try {
    if (!process.env.DATA_GOLF_API_KEY) {
      console.error('DATA_GOLF_API_KEY is not set')
      throw new Error('API key not configured')
    }

    const liveStats = await fetchLiveStats()
    return NextResponse.json(liveStats)
  } catch (error) {
    console.error('Live stats error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}
