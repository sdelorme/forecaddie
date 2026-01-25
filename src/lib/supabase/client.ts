import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const apiKey = publishableKey || anonKey

  if (!apiKey) {
    throw new Error('Missing Supabase publishable or anon key')
  }

  return createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, apiKey)
}
