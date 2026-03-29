import { NextRequest, NextResponse } from 'next/server'
import { authenticateRoute, unauthorizedResponse } from '@/lib/supabase/route-auth'
import { isValidUUID, invalidUUIDResponse, parseBody } from '@/lib/api/validation/utils'
import { CreateCommentSchema } from '@/lib/api/validation/schemas'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  const eventId = request.nextUrl.searchParams.get('event_id')
  if (!eventId) {
    return NextResponse.json({ error: 'event_id query param is required' }, { status: 400 })
  }

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const { data: comments, error } = await supabase
      .from('plan_comments')
      .select('*')
      .eq('plan_id', id)
      .eq('event_id', eventId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[comments:list]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    const userIds = Array.from(new Set((comments ?? []).map((c) => c.user_id)))
    const { data: profiles } =
      userIds.length > 0 ? await supabase.from('user_profiles').select('id, username').in('id', userIds) : { data: [] }

    const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.username]))
    const enriched = (comments ?? []).map((c) => ({
      ...c,
      username: nameMap.get(c.user_id) ?? null
    }))

    return NextResponse.json(enriched, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error('[comments:list]', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params

  if (!isValidUUID(id)) return invalidUUIDResponse('id')

  try {
    const { supabase, user } = await authenticateRoute()
    if (!supabase || !user) return unauthorizedResponse()

    const parsed = await parseBody(request, CreateCommentSchema)
    if (parsed.error) return parsed.error

    const { event_id, body, parent_id } = parsed.data

    const { data: plan, error: planError } = await supabase.from('season_plans').select('id').eq('id', id).single()

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    if (parent_id) {
      const { data: parent } = await supabase
        .from('plan_comments')
        .select('id, parent_id')
        .eq('id', parent_id)
        .eq('plan_id', id)
        .single()

      if (!parent) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 })
      }

      if (parent.parent_id) {
        return NextResponse.json({ error: 'Cannot reply to a reply' }, { status: 400 })
      }
    }

    const { data, error } = await supabase
      .from('plan_comments')
      .insert({
        plan_id: id,
        event_id,
        user_id: user.id,
        parent_id: parent_id ?? null,
        body
      })
      .select()
      .single()

    if (error) {
      console.error('[comments:create]', { userId: user.id, error: error.message })
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    const { data: profile } = await supabase.from('user_profiles').select('username').eq('id', user.id).single()

    return NextResponse.json(
      { ...data, username: profile?.username ?? null },
      { status: 201, headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('[comments:create]', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
