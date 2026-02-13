import { NextResponse } from 'next/server'
import { getHistoricalEventResults } from '@/lib/api/datagolf/queries/historical-events'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'

type RouteParams = {
  params: Promise<{ eventId: string; year: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { user } = await authenticateRoute()
  if (!user) return unauthorizedResponse()

  const { eventId, year } = await params

  const numericEventId = Number(eventId)
  const numericYear = Number(year)

  if (Number.isNaN(numericEventId) || Number.isNaN(numericYear)) {
    return NextResponse.json({ error: 'Invalid eventId or year' }, { status: 400 })
  }

  if (numericYear < 2010 || numericYear > new Date().getFullYear()) {
    return NextResponse.json({ error: 'Year out of range' }, { status: 400 })
  }

  if (numericEventId < 1) {
    return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 })
  }

  try {
    const results = await getHistoricalEventResults(numericEventId, numericYear)
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error(`Error fetching historical results for event ${eventId} year ${year}:`, error)
    return NextResponse.json({ error: 'Failed to fetch historical event results' }, { status: 500 })
  }
}
