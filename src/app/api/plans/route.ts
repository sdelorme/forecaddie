import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

    // RLS ensures only user's own plans are returned
    const { data, error } = await supabase
      .from('season_plans')
      .select('*, picks(count)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching plans:', error)
      return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
    }

    // Flatten the picks count into a simple field
    const plans = (data ?? []).map(({ picks, ...plan }) => ({
      ...plan,
      picks_count: picks?.[0]?.count ?? 0
    }))

    return NextResponse.json(plans, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const { name, season } = body

    // Validate name
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Plan name is required' }, { status: 400 })
    }

    // Validate season (default to current year if not provided)
    const validatedSeason = season === undefined ? new Date().getFullYear() : season
    if (typeof validatedSeason !== 'number' || !Number.isInteger(validatedSeason)) {
      return NextResponse.json({ error: 'Season must be a valid year' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('season_plans')
      .insert({
        user_id: user.id,
        name: name.trim(),
        season: validatedSeason
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating plan:', error.message, error.code, error.details, error.hint)
      return NextResponse.json(
        { error: 'Failed to create plan', detail: error.message, code: error.code, hint: error.hint },
        { status: 500 }
      )
    }

    return NextResponse.json(data, {
      status: 201,
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}
