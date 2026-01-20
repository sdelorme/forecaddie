'use client'

import { useCallback, useEffect, useState } from 'react'
import { getOrCreateDeviceId } from '../device'
import type { SeasonPlan } from '../types'

type UsePlansReturn = {
  plans: SeasonPlan[]
  isLoading: boolean
  error: string | null
  createPlan: (name: string, season?: number) => Promise<SeasonPlan | null>
  updatePlan: (id: string, updates: { name?: string; season?: number }) => Promise<SeasonPlan | null>
  deletePlan: (id: string) => Promise<boolean>
  refetch: () => Promise<void>
}

export function usePlans(): UsePlansReturn {
  const [plans, setPlans] = useState<SeasonPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)

  // Initialize device ID
  useEffect(() => {
    getOrCreateDeviceId()
      .then(setDeviceId)
      .catch((err) => {
        console.error('Failed to get device ID:', err)
        setError('Failed to initialize device')
        setIsLoading(false)
      })
  }, [])

  // Fetch plans when device ID is available
  const fetchPlans = useCallback(async () => {
    if (!deviceId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/plans', {
        headers: { 'x-device-id': deviceId }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch plans')
      }

      const data = await response.json()
      setPlans(data)
    } catch (err) {
      console.error('Error fetching plans:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch plans')
    } finally {
      setIsLoading(false)
    }
  }, [deviceId])

  useEffect(() => {
    if (deviceId) {
      fetchPlans()
    }
  }, [deviceId, fetchPlans])

  const createPlan = useCallback(
    async (name: string, season = 2025): Promise<SeasonPlan | null> => {
      if (!deviceId) {
        setError('Device not initialized')
        return null
      }

      try {
        const response = await fetch('/api/plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-device-id': deviceId
          },
          body: JSON.stringify({ name, season })
        })

        if (!response.ok) {
          throw new Error('Failed to create plan')
        }

        const newPlan = await response.json()
        setPlans((prev) => [newPlan, ...prev])
        return newPlan
      } catch (err) {
        console.error('Error creating plan:', err)
        setError(err instanceof Error ? err.message : 'Failed to create plan')
        return null
      }
    },
    [deviceId]
  )

  const updatePlan = useCallback(
    async (id: string, updates: { name?: string; season?: number }): Promise<SeasonPlan | null> => {
      if (!deviceId) {
        setError('Device not initialized')
        return null
      }

      try {
        const response = await fetch(`/api/plans/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-device-id': deviceId
          },
          body: JSON.stringify(updates)
        })

        if (!response.ok) {
          throw new Error('Failed to update plan')
        }

        const updatedPlan = await response.json()
        setPlans((prev) => prev.map((p) => (p.id === id ? updatedPlan : p)))
        return updatedPlan
      } catch (err) {
        console.error('Error updating plan:', err)
        setError(err instanceof Error ? err.message : 'Failed to update plan')
        return null
      }
    },
    [deviceId]
  )

  const deletePlan = useCallback(
    async (id: string): Promise<boolean> => {
      if (!deviceId) {
        setError('Device not initialized')
        return false
      }

      try {
        const response = await fetch(`/api/plans/${id}`, {
          method: 'DELETE',
          headers: { 'x-device-id': deviceId }
        })

        if (!response.ok) {
          throw new Error('Failed to delete plan')
        }

        setPlans((prev) => prev.filter((p) => p.id !== id))
        return true
      } catch (err) {
        console.error('Error deleting plan:', err)
        setError(err instanceof Error ? err.message : 'Failed to delete plan')
        return false
      }
    },
    [deviceId]
  )

  return {
    plans,
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    refetch: fetchPlans
  }
}
