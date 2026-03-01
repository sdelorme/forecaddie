import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { parseBody } from '@/lib/api/validation/utils'
import { CreatePlanSchema } from '@/lib/api/validation/schemas'

export async function GET() {
  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    // RLS ensures only plans visible to this member are returned
    const { data, error } = await supabase
      .from('season_plans')
      .select('*, picks(count), plan_members!inner(role, user_id)')
      .eq('plan_members.user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[plans:list]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
    }

    // Flatten the picks count into a simple field
    const plans = (data ?? []).map(({ picks, plan_members, ...plan }) => ({
      ...plan,
      picks_count: picks?.[0]?.count ?? 0,
      member_role: plan_members?.[0]?.role
    }))

    return NextResponse.json(plans, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[plans:list]', error)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const parsed = await parseBody(request, CreatePlanSchema)
    if (parsed.error) return parsed.error

    const { name, season } = parsed.data
    const validatedSeason = season ?? new Date().getFullYear()

    const { data, error } = await supabase
      .from('season_plans')
      .insert({
        user_id: user.id,
        name,
        season: validatedSeason
      })
      .select()
      .single()

    if (error) {
      console.error('[plans:create]', {
        userId: user.id,
        error: error.message
      })

      if (error.code === '23505') {
        return NextResponse.json({ error: 'A plan with that name already exists' }, { status: 409 })
      }

      return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
    }

    return NextResponse.json(data, {
      status: 201,
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[plans:create]', error)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}
