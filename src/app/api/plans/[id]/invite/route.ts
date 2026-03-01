import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse, parseBody } from '@/lib/api/validation/utils'
import { InvitePlanSchema } from '@/lib/api/validation/schemas'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const parsed = await parseBody(request, InvitePlanSchema)
    if (parsed.error) return parsed.error

    const { email, role } = parsed.data

    const { data: membership, error: membershipError } = await supabase
      .from('plan_members')
      .select('role')
      .eq('plan_id', id)
      .eq('user_id', user.id)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    if (membership.role !== 'owner' && membership.role !== 'editor') {
      return NextResponse.json({ error: 'Insufficient permissions to invite members' }, { status: 403 })
    }

    const { data: inviteeId, error: lookupError } = await supabase.rpc('get_user_id_by_email', {
      user_email: email
    })

    if (lookupError) {
      console.error('[plans:invite] lookup error', { userId: user.id, error: lookupError.message })
      return NextResponse.json({ error: 'Failed to lookup user' }, { status: 500 })
    }

    if (!inviteeId) {
      return NextResponse.json({ error: 'No user found with that email' }, { status: 404 })
    }

    if (inviteeId === user.id) {
      return NextResponse.json({ error: 'You are already a member' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('plan_members')
      .insert({ plan_id: id, user_id: inviteeId, role })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'User is already a member of this plan' }, { status: 409 })
      }
      console.error('[plans:invite]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to add member' }, { status: 500 })
    }

    return NextResponse.json(data, {
      status: 201,
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[plans:invite]', error)
    return NextResponse.json({ error: 'Failed to invite member' }, { status: 500 })
  }
}
