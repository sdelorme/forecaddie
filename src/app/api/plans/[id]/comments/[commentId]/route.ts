import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse, parseBody } from '@/lib/api/validation/utils'
import { UpdateCommentSchema } from '@/lib/api/validation/schemas'

type RouteParams = {
  params: Promise<{ id: string; commentId: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id, commentId } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')
  if (!isValidUUID(commentId)) return invalidUUIDResponse('commentId')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const parsed = await parseBody(request, UpdateCommentSchema)
    if (parsed.error) return parsed.error

    const { body } = parsed.data

    const { data, error } = await supabase
      .from('plan_comments')
      .update({ body, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .eq('plan_id', id)
      .eq('user_id', user.id)
      .select('id, plan_id, event_id, user_id, body, parent_id, created_at, updated_at')
      .single()

    if (error) {
      console.error('[comments:update]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Comment not found or not owned by you' }, { status: 404 })
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[comments:update]', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id, commentId } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')
  if (!isValidUUID(commentId)) return invalidUUIDResponse('commentId')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { error } = await supabase.from('plan_comments').delete().eq('id', commentId).eq('plan_id', id)

    if (error) {
      console.error('[comments:delete]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true },
      {
        headers: { 'Cache-Control': 'no-store' }
      }
    )
  } catch (error) {
    console.error('[comments:delete]', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
