import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse } from '@/lib/api/validation/utils'

type RouteParams = {
  params: Promise<{ id: string; userId: string }>
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id, userId } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')
  if (!isValidUUID(userId)) return invalidUUIDResponse('userId')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { error } = await supabase.from('plan_members').delete().eq('plan_id', id).eq('user_id', userId)

    if (error) {
      console.error('[plans:members:delete]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true },
      {
        headers: { 'Cache-Control': 'no-store' }
      }
    )
  } catch (error) {
    console.error('[plans:members:delete]', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}
