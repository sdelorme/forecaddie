import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { parseBody } from '@/lib/api/validation/utils'
import { UpsertPurseSchema } from '@/lib/api/validation/schemas'
import { rateLimit } from '@/lib/api/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { allowed } = rateLimit(`purse:${user.id}`, { max: 10, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const parsed = await parseBody(request, UpsertPurseSchema)
    if (parsed.error) return parsed.error

    const { dg_event_id, season, event_name, purse } = parsed.data

    const { data, error } = await supabase
      .from('tournament_purses')
      .upsert({ dg_event_id, season, event_name, purse, updated_by: user.id }, { onConflict: 'dg_event_id,season' })
      .select('id, dg_event_id, season, event_name, purse, created_at')
      .single()

    if (error) {
      console.error('[tournament-purses:upsert]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to save purse' }, { status: 500 })
    }

    return NextResponse.json(data, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[tournament-purses:upsert]', error)
    return NextResponse.json({ error: 'Failed to save purse' }, { status: 500 })
  }
}
