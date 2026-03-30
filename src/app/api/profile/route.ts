import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { parseBody } from '@/lib/api/validation/utils'
import { UpdateProfileSchema } from '@/lib/api/validation/schemas'
import { rateLimit } from '@/lib/api/rate-limit'

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
  } catch (err) {
    console.error('[profile:get]', err)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { allowed } = rateLimit(`profile:${user.id}`, { max: 10, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const parsed = await parseBody(request, UpdateProfileSchema)
    if (parsed.error) return parsed.error

    const { username } = parsed.data

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
      .select('id, username, email, updated_at')
      .single()

    if (error) {
      console.error('[profile:update]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[profile:update]', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
