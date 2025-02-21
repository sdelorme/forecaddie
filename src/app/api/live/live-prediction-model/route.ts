import { LiveModelPlayerResponse } from '@/types/live-events'
import { NextResponse } from 'next/server'
import { toCamelCase } from '@/lib/utils/case-conversion'

const LIVE_EVENT_URL = `https://feeds.datagolf.com/preds/in-play?key=${process.env.DATA_GOLF_API_KEY}`

async function fetchLivePredictionModel(): Promise<LiveModelPlayerResponse> {
  const response = await fetch(LIVE_EVENT_URL)

  if (!response.ok) {
    console.error('DataGolf API error:', response.status, response.statusText)
    throw new Error('Failed to fetch live stats')
  }

  const data = await response.json()
  return data
}

export async function GET() {
  try {
    if (!process.env.DATA_GOLF_API_KEY) {
      console.error('DATA_GOLF_API_KEY is not set')
      throw new Error('API key not configured')
    }

    const liveStats = await fetchLivePredictionModel()
    const camelCasePredictionStats = toCamelCase(liveStats)

    return NextResponse.json(camelCasePredictionStats)
  } catch (error) {
    console.error('Live stats error:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}
