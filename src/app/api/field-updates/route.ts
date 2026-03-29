import { NextRequest, NextResponse } from 'next/server'
import { getFieldUpdates } from '@/lib/api/datagolf'
import { rateLimit } from '@/lib/api/rate-limit'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = rateLimit(`field-updates:${ip}`, { max: 20, windowMs: 60_000 })
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const data = await getFieldUpdates()
    if (!data) {
      return NextResponse.json(null, { status: 204 })
    }
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    })
  } catch (error) {
    console.error('Error fetching field updates:', error)
    return NextResponse.json({ error: 'Failed to fetch field updates' }, { status: 500 })
  }
}
