import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse } from '@/lib/api/validation/utils'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { data, error } = await supabase
      .from('plan_members')
      .select('id, user_id, role, created_at')
      .eq('plan_id', id)
      .order('created_at')

    if (error) {
      console.error('[plans:members]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
    }

    return NextResponse.json(data ?? [], {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[plans:members]', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}
