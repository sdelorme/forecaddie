import { NextResponse } from 'next/server'
import { getLiveLeaderboard } from '@/lib/api/datagolf'

export async function GET() {
  try {
    const data = await getLiveLeaderboard()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching live stats:', error)
    return NextResponse.json({ error: 'Failed to fetch live stats' }, { status: 500 })
  }
}
