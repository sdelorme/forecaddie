import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteParams = {
  params: Promise<{ id: string; pickId: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id, pickId } = await params

  try {
    const supabase = await createClient()

    // Get current user from session
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { player_dg_id } = body

    // OAD constraint: each player can only be used once per plan
    if (player_dg_id !== undefined && player_dg_id !== null) {
      const { data: existingPlayerPick } = await supabase
        .from('picks')
        .select('id, event_id')
        .eq('plan_id', id)
        .eq('player_dg_id', player_dg_id)
        .neq('id', pickId)
        .limit(1)
        .single()

      if (existingPlayerPick) {
        return NextResponse.json(
          { error: 'Player already used in this plan', event_id: existingPlayerPick.event_id },
          { status: 409 }
        )
      }
    }

    const { data, error } = await supabase
      .from('picks')
      .update({
        player_dg_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', pickId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Pick not found' }, { status: 404 })
      }
      console.error('Error updating pick:', error)
      return NextResponse.json({ error: 'Failed to update pick' }, { status: 500 })
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('Error updating pick:', error)
    return NextResponse.json({ error: 'Failed to update pick' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { pickId } = await params

  try {
    const supabase = await createClient()

    // Get current user from session
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase.from('picks').delete().eq('id', pickId)

    if (error) {
      console.error('Error deleting pick:', error)
      return NextResponse.json({ error: 'Failed to delete pick' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true },
      {
        headers: { 'Cache-Control': 'no-store' }
      }
    )
  } catch (error) {
    console.error('Error deleting pick:', error)
    return NextResponse.json({ error: 'Failed to delete pick' }, { status: 500 })
  }
}
