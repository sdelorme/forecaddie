import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse, parseBody } from '@/lib/api/validation/utils'
import { CreatePickSchema } from '@/lib/api/validation/schemas'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { data, error } = await supabase.from('picks').select('*').eq('plan_id', id).order('created_at')

    if (error) {
      console.error('[picks:list]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to fetch picks' }, { status: 500 })
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[picks:list]', error)
    return NextResponse.json({ error: 'Failed to fetch picks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const parsed = await parseBody(request, CreatePickSchema)
    if (parsed.error) return parsed.error

    const { event_id, player_dg_id } = parsed.data

    // Verify plan exists and belongs to user
    const { data: plan, error: planError } = await supabase
      .from('season_plans')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // OAD constraint: each player can only be used once per plan
    if (player_dg_id !== null && player_dg_id !== undefined) {
      const { data: existingPlayerPick } = await supabase
        .from('picks')
        .select('event_id')
        .eq('plan_id', id)
        .eq('player_dg_id', player_dg_id)
        .limit(1)
        .single()

      if (existingPlayerPick) {
        return NextResponse.json(
          {
            error: 'Player already used in this plan',
            event_id: existingPlayerPick.event_id
          },
          { status: 409 }
        )
      }
    }

    // Unique event constraint: one pick per event per plan
    const { data: existingEventPick } = await supabase
      .from('picks')
      .select('id')
      .eq('plan_id', id)
      .eq('event_id', event_id)
      .limit(1)
      .single()

    if (existingEventPick) {
      return NextResponse.json({ error: 'Pick already exists for this event' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('picks')
      .insert({
        user_id: user.id,
        plan_id: id,
        event_id,
        player_dg_id: player_dg_id ?? null
      })
      .select()
      .single()

    if (error) {
      console.error('[picks:create]', {
        userId: user.id,
        error: error.message
      })

      if (error.code === '23505') {
        return NextResponse.json({ error: 'Constraint violation: duplicate pick' }, { status: 409 })
      }

      return NextResponse.json({ error: 'Failed to create pick' }, { status: 500 })
    }

    return NextResponse.json(data, {
      status: 201,
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[picks:create]', error)
    return NextResponse.json({ error: 'Failed to create pick' }, { status: 500 })
  }
}
