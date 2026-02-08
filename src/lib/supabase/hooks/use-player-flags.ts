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

/**
 * Manages player favorites (season-long) and flags (tournament-scoped).
 *
 * - Favorites persist all season (event_id is ignored).
 * - Flags are scoped to the current event: `isFlagged` is only true when
 *   the stored `event_id` matches the provided `currentEventId`.
 */
export function usePlayerFlags(currentEventId?: string): UsePlayerFlagsReturn {
  const [flags, setFlags] = useState<Map<number, PlayerFlagState>>(new Map())
  /** Raw rows from DB — needed so we can check event_id when computing state */
  const [rawFlags, setRawFlags] = useState<PlayerFlag[]>([])
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

  /**
   * Derive the client-facing flag map from raw DB rows.
   * Favorites: `is_favorite` (always shown).
   * Flags: `is_flagged && event_id === currentEventId`.
   */
  const buildFlagMap = useCallback(
    (rows: PlayerFlag[]): Map<number, PlayerFlagState> => {
      const map = new Map<number, PlayerFlagState>()
      rows.forEach((row) => {
        const isFlagged = row.is_flagged && row.event_id === (currentEventId ?? null)
        // Only add to map if at least one flag is active
        if (row.is_favorite || isFlagged) {
          map.set(row.player_dg_id, {
            isFavorite: row.is_favorite,
            isFlagged
          })
        }
      })
      return map
    },
    [currentEventId]
  )

  // Re-derive flags when the current event changes
  useEffect(() => {
    if (rawFlags.length > 0) {
      setFlags(buildFlagMap(rawFlags))
    }
  }, [rawFlags, buildFlagMap])

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

      const rows = (data ?? []) as PlayerFlag[]
      setRawFlags(rows)
      setFlags(buildFlagMap(rows))
    } catch (err) {
      console.error('Error fetching player flags:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch flags')
    } finally {
      setIsLoading(false)
    }
  }, [userId, supabase, buildFlagMap])

  useEffect(() => {
    if (userId) {
      fetchFlags()
    }
  }, [userId, fetchFlags])

  const upsertFlag = useCallback(
    async (playerDgId: number, updates: Partial<PlayerFlagState>, eventId?: string | null) => {
      if (!userId) {
        setError('Not authenticated')
        return
      }

      // Find existing raw row for this player
      const existingRow = rawFlags.find((r) => r.player_dg_id === playerDgId)
      const currentFlag = flags.get(playerDgId) || DEFAULT_FLAG_STATE
      const newFlag = { ...currentFlag, ...updates }

      // Determine the event_id to store
      const newEventId = eventId !== undefined ? eventId : (existingRow?.event_id ?? null)

      // Optimistic update
      setFlags((prev) => {
        const next = new Map(prev)
        next.set(playerDgId, newFlag)
        return next
      })

      // Optimistic raw update
      const newRawRow: PlayerFlag = {
        id: existingRow?.id ?? '',
        user_id: userId,
        player_dg_id: playerDgId,
        is_favorite: newFlag.isFavorite,
        is_flagged: newFlag.isFlagged,
        event_id: newEventId,
        created_at: existingRow?.created_at ?? new Date().toISOString()
      }
      setRawFlags((prev) => {
        const idx = prev.findIndex((r) => r.player_dg_id === playerDgId)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = newRawRow
          return next
        }
        return [...prev, newRawRow]
      })

      try {
        const { error } = await supabase.from('player_flags').upsert(
          {
            user_id: userId,
            player_dg_id: playerDgId,
            is_favorite: newFlag.isFavorite,
            is_flagged: newFlag.isFlagged,
            event_id: newEventId
          },
          {
            onConflict: 'user_id,player_dg_id'
          }
        )

        if (error) {
          // Rollback on error
          setRawFlags((prev) => {
            if (existingRow) {
              return prev.map((r) => (r.player_dg_id === playerDgId ? existingRow : r))
            }
            return prev.filter((r) => r.player_dg_id !== playerDgId)
          })
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
    [userId, flags, rawFlags, supabase]
  )

  const toggleFavorite = useCallback(
    async (playerDgId: number) => {
      const currentFlag = flags.get(playerDgId) || DEFAULT_FLAG_STATE
      // Favorites don't touch event_id — pass undefined to keep existing
      await upsertFlag(playerDgId, { isFavorite: !currentFlag.isFavorite })
    },
    [flags, upsertFlag]
  )

  const toggleFlag = useCallback(
    async (playerDgId: number) => {
      const currentFlag = flags.get(playerDgId) || DEFAULT_FLAG_STATE
      const willBeFlagged = !currentFlag.isFlagged

      // When flagging, store the current event ID.
      // When unflagging, clear the event ID.
      await upsertFlag(playerDgId, { isFlagged: willBeFlagged }, willBeFlagged ? (currentEventId ?? null) : null)
    },
    [flags, upsertFlag, currentEventId]
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
