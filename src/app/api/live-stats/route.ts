import { NextRequest, NextResponse } from 'next/server'
import { getLiveLeaderboard } from '@/lib/api/datagolf'
import { rateLimit } from '@/lib/api/rate-limit'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = rateLimit(`live-stats:${ip}`, { max: 30, windowMs: 60_000 })
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

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
