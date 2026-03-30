import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const checks: Record<string, 'ok' | 'fail' | 'skip'> = {}

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error } = await supabase.from('user_profiles').select('id').limit(1)
      checks.supabase = error ? 'fail' : 'ok'
    } catch {
      checks.supabase = 'fail'
    }
  } else {
    checks.supabase = 'skip'
  }

  if (process.env.DATA_GOLF_API_KEY) {
    try {
      const res = await fetch('https://feeds.datagolf.com/get-schedule?key=' + process.env.DATA_GOLF_API_KEY, {
        signal: AbortSignal.timeout(5000),
        cache: 'no-store'
      })
      checks.datagolf = res.ok ? 'ok' : 'fail'
    } catch {
      checks.datagolf = 'fail'
    }
  } else {
    checks.datagolf = 'skip'
  }

  const healthy = Object.values(checks).every((v) => v !== 'fail')

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks
    },
    { status: healthy ? 200 : 503 }
  )
}
