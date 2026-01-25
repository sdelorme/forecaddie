import { createClient } from './server'
import type { User } from '@supabase/supabase-js'

export type AuthResult = { user: User; error: null } | { user: null; error: string }

/**
 * Get the current authenticated user from server context.
 * Returns the user if authenticated, or an error message if not.
 */
export async function getUser(): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      return { user: null, error: error.message }
    }

    if (!user) {
      return { user: null, error: 'Not authenticated' }
    }

    return { user, error: null }
  } catch (err) {
    console.error('Error getting user:', err)
    return { user: null, error: 'Failed to get user session' }
  }
}

/**
 * Require authentication for a server action or API route.
 * Throws an error if not authenticated.
 */
export async function requireUser(): Promise<User> {
  const result = await getUser()

  if (result.error || !result.user) {
    throw new Error(result.error || 'Authentication required')
  }

  return result.user
}

/**
 * Get user ID if authenticated, or null if not.
 * Useful for optional auth scenarios.
 */
export async function getUserId(): Promise<string | null> {
  const result = await getUser()
  return result.user?.id ?? null
}
