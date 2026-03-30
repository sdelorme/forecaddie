import * as Sentry from '@sentry/nextjs'

const REQUIRED_ENV = ['DATA_GOLF_API_KEY', 'NEXT_PUBLIC_SUPABASE_URL'] as const

const REQUIRED_ONE_OF = [['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']] as const

function validateEnv() {
  const missing: string[] = []

  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) missing.push(key)
  }

  for (const group of REQUIRED_ONE_OF) {
    if (!group.some((key) => process.env[key])) {
      missing.push(group.join(' or '))
    }
  }

  if (missing.length > 0) {
    const msg = `Missing required env vars: ${missing.join(', ')}`
    console.error(`[env:validation] ${msg}`)
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg)
    }
  }
}

export async function register() {
  validateEnv()

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export const onRequestError = Sentry.captureRequestError
