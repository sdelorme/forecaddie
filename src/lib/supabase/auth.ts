import { createClient } from './server'
import type { User } from '@supabase/supabase-js'

export type AuthErrorCode = 'NOT_AUTHENTICATED' | 'SESSION_EXPIRED' | 'SESSION_ERROR'

export type AuthError = {
  code: AuthErrorCode
  message: string
}

export type AuthResult = { user: User; error: null } | { user: null; error: AuthError }

/**
 * Get the current authenticated user from server context.
 * Returns the user if authenticated, or a typed error object if not.
 */
export async function getUser(): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) {
      return {
        user: null,
        error: {
          code: 'SESSION_EXPIRED',
          message: error.message
        }
      }
    }

    if (!user) {
      return {
        user: null,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Not authenticated'
        }
      }
    }

    return { user, error: null }
  } catch (err) {
    console.error('Error getting user:', err)
    return {
      user: null,
      error: {
        code: 'SESSION_ERROR',
        message: 'Failed to get user session'
      }
    }
  }
}

/**
 * Require authentication for a server action or API route.
 * Throws an error if not authenticated.
 */
export async function requireUser(): Promise<User> {
  const result = await getUser()

  if (result.error || !result.user) {
    throw new Error(result.error?.message || 'Authentication required')
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
