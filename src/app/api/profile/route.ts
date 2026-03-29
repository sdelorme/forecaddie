import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'

const USERNAME_RE = /^[a-z0-9][a-z0-9_]*[a-z0-9]$/

export async function GET() {
  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, username, email')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const body = await request.json()
    const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : null

    if (!username || username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Username must be 3–20 characters' }, { status: 400 })
    }

    if (!USERNAME_RE.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain lowercase letters, numbers, and underscores' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('[profile:update]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
