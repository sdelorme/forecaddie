import { NextResponse } from 'next/server'
import { getFieldUpdates } from '@/lib/api/datagolf'

export async function GET() {
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
