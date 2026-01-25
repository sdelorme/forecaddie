'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '../client'
import type { PlayerFlag } from '../types'

type PlayerFlagState = {
  isFavorite: boolean
  isFlagged: boolean
}

type UsePlayerFlagsReturn = {
  flags: Map<number, PlayerFlagState>
  isLoading: boolean
  error: string | null
  toggleFavorite: (playerDgId: number) => Promise<void>
  toggleFlag: (playerDgId: number) => Promise<void>
  getPlayerFlag: (playerDgId: number) => PlayerFlagState
  refetch: () => Promise<void>
}

const DEFAULT_FLAG_STATE: PlayerFlagState = {
  isFavorite: false,
  isFlagged: false
}

export function usePlayerFlags(): UsePlayerFlagsReturn {
  const [flags, setFlags] = useState<Map<number, PlayerFlagState>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createClient()

  // Get user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null)
      if (!user) {
        setIsLoading(false)
      }
    })
  }, [supabase.auth])

  // Fetch flags when user is available
  const fetchFlags = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.from('player_flags').select('*').eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      const flagMap = new Map<number, PlayerFlagState>()
      data?.forEach((flag: PlayerFlag) => {
        flagMap.set(flag.player_dg_id, {
          isFavorite: flag.is_favorite,
          isFlagged: flag.is_flagged
        })
      })

      setFlags(flagMap)
    } catch (err) {
      console.error('Error fetching player flags:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch flags')
    } finally {
      setIsLoading(false)
    }
  }, [userId, supabase])

  useEffect(() => {
    if (userId) {
      fetchFlags()
    }
  }, [userId, fetchFlags])

  const upsertFlag = useCallback(
    async (playerDgId: number, updates: Partial<PlayerFlagState>) => {
      if (!userId) {
        setError('Not authenticated')
        return
      }

      const currentFlag = flags.get(playerDgId) || DEFAULT_FLAG_STATE
      const newFlag = { ...currentFlag, ...updates }

      // Optimistic update
      setFlags((prev) => {
        const next = new Map(prev)
        next.set(playerDgId, newFlag)
        return next
      })

      try {
        const { error } = await supabase.from('player_flags').upsert(
          {
            user_id: userId,
            player_dg_id: playerDgId,
            is_favorite: newFlag.isFavorite,
            is_flagged: newFlag.isFlagged
          },
          {
            onConflict: 'user_id,player_dg_id'
          }
        )

        if (error) {
          // Rollback on error
          setFlags((prev) => {
            const next = new Map(prev)
            if (currentFlag.isFavorite || currentFlag.isFlagged) {
              next.set(playerDgId, currentFlag)
            } else {
              next.delete(playerDgId)
            }
            return next
          })
          throw new Error(error.message)
        }
      } catch (err) {
        console.error('Error updating player flag:', err)
        setError(err instanceof Error ? err.message : 'Failed to update flag')
      }
    },
    [userId, flags, supabase]
  )

  const toggleFavorite = useCallback(
    async (playerDgId: number) => {
      const currentFlag = flags.get(playerDgId) || DEFAULT_FLAG_STATE
      await upsertFlag(playerDgId, { isFavorite: !currentFlag.isFavorite })
    },
    [flags, upsertFlag]
  )

  const toggleFlag = useCallback(
    async (playerDgId: number) => {
      const currentFlag = flags.get(playerDgId) || DEFAULT_FLAG_STATE
      await upsertFlag(playerDgId, { isFlagged: !currentFlag.isFlagged })
    },
    [flags, upsertFlag]
  )

  const getPlayerFlag = useCallback(
    (playerDgId: number): PlayerFlagState => {
      return flags.get(playerDgId) || DEFAULT_FLAG_STATE
    },
    [flags]
  )

  return {
    flags,
    isLoading,
    error,
    toggleFavorite,
    toggleFlag,
    getPlayerFlag,
    refetch: fetchFlags
  }
}
