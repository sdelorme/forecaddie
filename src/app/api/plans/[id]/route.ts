import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const deviceId = request.headers.get('x-device-id')

  if (!deviceId) {
    return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('season_plans')
      .select('*')
      .eq('id', id)
      .eq('device_id', deviceId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      console.error('Error fetching plan:', error)
      return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching plan:', error)
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const deviceId = request.headers.get('x-device-id')

  if (!deviceId) {
    return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { name, season } = body

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (name !== undefined) updates.name = name.trim()
    if (season !== undefined) updates.season = season

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('season_plans')
      .update(updates)
      .eq('id', id)
      .eq('device_id', deviceId)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
      }
      console.error('Error updating plan:', error)
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const deviceId = request.headers.get('x-device-id')

  if (!deviceId) {
    return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('season_plans').delete().eq('id', id).eq('device_id', deviceId)

    if (error) {
      console.error('Error deleting plan:', error)
      return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
  }
}
