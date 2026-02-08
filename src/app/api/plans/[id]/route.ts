import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse, parseBody } from '@/lib/api/validation/utils'
import { UpdatePlanSchema } from '@/lib/api/validation/schemas'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    // RLS ensures user can only access their own plans
    const { data, error } = await supabase.from('season_plans').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      console.error('[plans:get]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[plans:get]', error)
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const parsed = await parseBody(request, UpdatePlanSchema)
    if (parsed.error) return parsed.error

    const { name, season } = parsed.data

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }
    if (name !== undefined) updates.name = name
    if (season !== undefined) updates.season = season

    // RLS ensures user can only update their own plans
    const { data, error } = await supabase.from('season_plans').update(updates).eq('id', id).select().single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      console.error('[plans:update]', {
        userId: user.id,
        error: error.message
      })
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[plans:update]', error)
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    // RLS ensures user can only delete their own plans
    const { error } = await supabase.from('season_plans').delete().eq('id', id)

    if (error) {
      console.error('[plans:delete]', {
        userId: user.id,
        error: error.message
      })
      return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true },
      {
        headers: { 'Cache-Control': 'no-store' }
      }
    )
  } catch (error) {
    console.error('[plans:delete]', error)
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
  }
}
