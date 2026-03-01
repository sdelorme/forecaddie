'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Pick } from '../types'

export type EventPicks = {
  locked: Pick | undefined
  option1: Pick | undefined
  option2: Pick | undefined
}

type UsePicksReturn = {
  picks: Pick[]
  isLoading: boolean
  error: string | null
  createPick: (eventId: string, playerDgId: number | null, slot?: 1 | 2 | 3) => Promise<Pick | null>
  updatePick: (pickId: string, playerDgId: number | null, slot?: 1 | 2 | 3) => Promise<Pick | null>
  deletePick: (pickId: string) => Promise<boolean>
  refetch: () => Promise<void>
  getPickForEvent: (eventId: string) => Pick | undefined
  getPicksForEvent: (eventId: string) => EventPicks
  getUsedPlayerIds: () => number[]
}

export function usePicks(planId: string): UsePicksReturn {
  const [picks, setPicks] = useState<Pick[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPicks = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true)
      setError(null)

      try {
        const timeoutSignal = AbortSignal.timeout(10_000)
        const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal

        const response = await fetch(`/api/plans/${planId}/picks`, {
          signal: combinedSignal
        })

        if (!response.ok) {
          throw new Error('Failed to fetch picks')
        }

        const data = await response.json()
        setPicks(data)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.')
          return
        }
        console.error('Error fetching picks:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch picks')
      } finally {
        setIsLoading(false)
      }
    },
    [planId]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchPicks(controller.signal)
    return () => controller.abort()
  }, [fetchPicks])

  const createPick = useCallback(
    async (eventId: string, playerDgId: number | null, slot: 1 | 2 | 3 = 1): Promise<Pick | null> => {
      setError(null)
      try {
        const response = await fetch(`/api/plans/${planId}/picks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ event_id: eventId, player_dg_id: playerDgId, slot }),
          signal: AbortSignal.timeout(10_000)
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
        if (err instanceof DOMException && err.name === 'AbortError') return null
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.')
          return null
        }
        console.error('Error creating pick:', err)
        setError(err instanceof Error ? err.message : 'Failed to create pick')
        return null
      }
    },
    [planId]
  )

  const updatePick = useCallback(
    async (pickId: string, playerDgId: number | null, slot?: 1 | 2 | 3): Promise<Pick | null> => {
      setError(null)
      try {
        const body: { player_dg_id: number | null; slot?: number } = { player_dg_id: playerDgId }
        if (slot !== undefined) body.slot = slot
        const response = await fetch(`/api/plans/${planId}/picks/${pickId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(10_000)
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
        if (err instanceof DOMException && err.name === 'AbortError') return null
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.')
          return null
        }
        console.error('Error updating pick:', err)
        setError(err instanceof Error ? err.message : 'Failed to update pick')
        return null
      }
    },
    [planId]
  )

  const deletePick = useCallback(
    async (pickId: string): Promise<boolean> => {
      setError(null)
      try {
        const response = await fetch(`/api/plans/${planId}/picks/${pickId}`, {
          method: 'DELETE',
          signal: AbortSignal.timeout(10_000)
        })

        if (!response.ok) {
          throw new Error('Failed to delete pick')
        }

        setPicks((prev) => prev.filter((p) => p.id !== pickId))
        return true
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return false
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.')
          return false
        }
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

  const getPicksForEvent = useCallback(
    (eventId: string): EventPicks => {
      const eventPicks = picks.filter((p) => p.event_id === eventId)
      return {
        locked: eventPicks.find((p) => p.slot === 1),
        option1: eventPicks.find((p) => p.slot === 2),
        option2: eventPicks.find((p) => p.slot === 3)
      }
    },
    [picks]
  )

  const getUsedPlayerIds = useCallback((): number[] => {
    return picks.filter((p) => p.slot === 1 && p.player_dg_id !== null).map((p) => p.player_dg_id!)
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
    getPicksForEvent,
    getUsedPlayerIds
  }
}
