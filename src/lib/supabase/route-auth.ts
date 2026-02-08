import { NextResponse } from 'next/server'
import { createClient } from './server'

export async function authenticateRoute() {
  const supabase = await createClient()
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase: null, user: null }
  }

  return { supabase, user }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
