import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse, parseBody } from '@/lib/api/validation/utils'
import { UpdatePickSchema } from '@/lib/api/validation/schemas'

type RouteParams = {
  params: Promise<{ id: string; pickId: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id, pickId } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')
  if (!isValidUUID(pickId)) return invalidUUIDResponse('pickId')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const parsed = await parseBody(request, UpdatePickSchema)
    if (parsed.error) return parsed.error

    const { player_dg_id, slot } = parsed.data

    // Fetch current pick to know its slot (for OAD check)
    const { data: currentPick } = await supabase
      .from('picks')
      .select('slot')
      .eq('id', pickId)
      .eq('plan_id', id)
      .single()

    const effectiveSlot = slot ?? currentPick?.slot ?? 1

    // OAD constraint: only slot 1 (locked) consumes player
    if (effectiveSlot === 1 && player_dg_id !== undefined && player_dg_id !== null) {
      const { data: existingPlayerPick } = await supabase
        .from('picks')
        .select('id, event_id')
        .eq('plan_id', id)
        .eq('player_dg_id', player_dg_id)
        .eq('slot', 1)
        .neq('id', pickId)
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

    const updatePayload: { player_dg_id?: number | null; slot?: number; updated_at: string } = {
      updated_at: new Date().toISOString()
    }
    if (player_dg_id !== undefined) updatePayload.player_dg_id = player_dg_id
    if (slot !== undefined) updatePayload.slot = slot

    const { data, error } = await supabase
      .from('picks')
      .update(updatePayload)
      .eq('id', pickId)
      .eq('plan_id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Pick not found' }, { status: 404 })
      }

      console.error('[picks:update]', {
        userId: user.id,
        error: error.message
      })

      if (error.code === '23505') {
        return NextResponse.json({ error: 'Constraint violation: duplicate pick' }, { status: 409 })
      }

      return NextResponse.json({ error: 'Failed to update pick' }, { status: 500 })
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[picks:update]', error)
    return NextResponse.json({ error: 'Failed to update pick' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id, pickId } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')
  if (!isValidUUID(pickId)) return invalidUUIDResponse('pickId')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { error } = await supabase.from('picks').delete().eq('id', pickId).eq('plan_id', id)

    if (error) {
      console.error('[picks:delete]', {
        userId: user.id,
        error: error.message
      })
      return NextResponse.json({ error: 'Failed to delete pick' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true },
      {
        headers: { 'Cache-Control': 'no-store' }
      }
    )
  } catch (error) {
    console.error('[picks:delete]', error)
    return NextResponse.json({ error: 'Failed to delete pick' }, { status: 500 })
  }
}
