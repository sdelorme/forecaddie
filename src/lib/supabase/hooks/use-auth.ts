'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '../client'
import type { User, AuthError } from '@supabase/supabase-js'

type AuthState = {
  user: User | null
  isLoading: boolean
  error: string | null
}

type UseAuthReturn = AuthState & {
  signInWithOtp: (email: string, redirectPath?: string | null) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  })

  const supabase = createClient()

  const refreshUser = useCallback(async () => {
    try {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      setState({
        user,
        isLoading: false,
        error: error?.message ?? null
      })
    } catch (err) {
      console.error('Error refreshing user:', err)
      setState({
        user: null,
        isLoading: false,
        error: 'Failed to get user session'
      })
    }
  }, [supabase.auth])

  useEffect(() => {
    refreshUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        isLoading: false
      }))
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshUser, supabase.auth])

  const signInWithOtp = useCallback(
    async (email: string, redirectPath?: string | null) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const callbackUrl = new URL('/auth/callback', window.location.origin)
      if (redirectPath && redirectPath.startsWith('/') && !redirectPath.startsWith('//')) {
        callbackUrl.searchParams.set('redirect', redirectPath)
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: callbackUrl.toString()
        }
      })

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error?.message ?? null
      }))

      return { error }
    },
    [supabase.auth]
  )

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    await supabase.auth.signOut()
    setState({ user: null, isLoading: false, error: null })
  }, [supabase.auth])

  return {
    ...state,
    signInWithOtp,
    signOut,
    refreshUser
  }
}
