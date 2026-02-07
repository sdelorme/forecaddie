'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Pick } from '../types'

type UsePicksReturn = {
  picks: Pick[]
  isLoading: boolean
  error: string | null
  createPick: (eventId: string, playerDgId: number | null) => Promise<Pick | null>
  updatePick: (pickId: string, playerDgId: number | null) => Promise<Pick | null>
  deletePick: (pickId: string) => Promise<boolean>
  refetch: () => Promise<void>
  getPickForEvent: (eventId: string) => Pick | undefined
  getUsedPlayerIds: () => number[]
}

export function usePicks(planId: string): UsePicksReturn {
  const [picks, setPicks] = useState<Pick[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPicks = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/plans/${planId}/picks`)

      if (!response.ok) {
        throw new Error('Failed to fetch picks')
      }

      const data = await response.json()
      setPicks(data)
    } catch (err) {
      console.error('Error fetching picks:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch picks')
    } finally {
      setIsLoading(false)
    }
  }, [planId])

  useEffect(() => {
    fetchPicks()
  }, [fetchPicks])

  const createPick = useCallback(
    async (eventId: string, playerDgId: number | null): Promise<Pick | null> => {
      try {
        const response = await fetch(`/api/plans/${planId}/picks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ event_id: eventId, player_dg_id: playerDgId })
        })

        if (response.status === 409) {
          const body = await response.json().catch(() => ({}))
          setError(body.detail || body.error || 'Conflict: duplicate or OAD violation')
          return null
        }

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          console.error('Pick creation failed:', body)
          throw new Error(body.detail || body.error || 'Failed to create pick')
        }

        const newPick = await response.json()
        setPicks((prev) => [newPick, ...prev])
        return newPick
      } catch (err) {
        console.error('Error creating pick:', err)
        setError(err instanceof Error ? err.message : 'Failed to create pick')
        return null
      }
    },
    [planId]
  )

  const updatePick = useCallback(
    async (pickId: string, playerDgId: number | null): Promise<Pick | null> => {
      try {
        const response = await fetch(`/api/plans/${planId}/picks/${pickId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ player_dg_id: playerDgId })
        })

        if (response.status === 409) {
          const body = await response.json().catch(() => ({}))
          setError(body.detail || body.error || 'Conflict: duplicate or OAD violation')
          return null
        }

        if (!response.ok) {
          throw new Error('Failed to update pick')
        }

        const updatedPick = await response.json()
        setPicks((prev) => prev.map((p) => (p.id === pickId ? updatedPick : p)))
        return updatedPick
      } catch (err) {
        console.error('Error updating pick:', err)
        setError(err instanceof Error ? err.message : 'Failed to update pick')
        return null
      }
    },
    [planId]
  )

  const deletePick = useCallback(
    async (pickId: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/plans/${planId}/picks/${pickId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete pick')
        }

        setPicks((prev) => prev.filter((p) => p.id !== pickId))
        return true
      } catch (err) {
        console.error('Error deleting pick:', err)
        setError(err instanceof Error ? err.message : 'Failed to delete pick')
        return false
      }
    },
    [planId]
  )

  const getPickForEvent = useCallback(
    (eventId: string): Pick | undefined => {
      return picks.find((p) => p.event_id === eventId)
    },
    [picks]
  )

  const getUsedPlayerIds = useCallback((): number[] => {
    return picks.filter((p) => p.player_dg_id !== null).map((p) => p.player_dg_id!)
  }, [picks])

  return {
    picks,
    isLoading,
    error,
    createPick,
    updatePick,
    deletePick,
    refetch: fetchPicks,
    getPickForEvent,
    getUsedPlayerIds
  }
}
