import { NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse } from '@/lib/api/validation/utils'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { data, error } = await supabase.from('plan_comments').select('event_id').eq('plan_id', id)

    if (error) {
      console.error('[comment-counts]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to fetch comment counts' }, { status: 500 })
    }

    const counts: Record<string, number> = {}
    for (const row of data ?? []) {
      counts[row.event_id] = (counts[row.event_id] ?? 0) + 1
    }

    return NextResponse.json(counts, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comment counts' }, { status: 500 })
  }
}
