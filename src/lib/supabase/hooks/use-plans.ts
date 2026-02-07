'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '../client'
import type { SeasonPlan } from '../types'

type UsePlansReturn = {
  plans: SeasonPlan[]
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  createPlan: (name: string, season?: number) => Promise<SeasonPlan | null>
  updatePlan: (id: string, updates: { name?: string; season?: number }) => Promise<SeasonPlan | null>
  deletePlan: (id: string) => Promise<boolean>
  refetch: () => Promise<void>
}

export function usePlans(): UsePlansReturn {
  const [plans, setPlans] = useState<SeasonPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const supabase = createClient()

  // Check auth status on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user)
      if (!user) {
        setIsLoading(false)
      }
    })
  }, [supabase.auth])

  // Fetch plans when authenticated
  const fetchPlans = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/plans')

      if (response.status === 401) {
        setIsAuthenticated(false)
        setError('Please sign in to view your plans')
        return
      }

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
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlans()
    }
  }, [isAuthenticated, fetchPlans])

  const createPlan = useCallback(
    async (name: string, season = new Date().getFullYear()): Promise<SeasonPlan | null> => {
      if (!isAuthenticated) {
        setError('Please sign in to create plans')
        return null
      }

      try {
        const response = await fetch('/api/plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, season })
        })

        if (response.status === 401) {
          setIsAuthenticated(false)
          setError('Please sign in to create plans')
          return null
        }

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          console.error('Plan creation failed:', body)
          throw new Error(body.detail || body.error || 'Failed to create plan')
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
    [isAuthenticated]
  )

  const updatePlan = useCallback(
    async (id: string, updates: { name?: string; season?: number }): Promise<SeasonPlan | null> => {
      if (!isAuthenticated) {
        setError('Please sign in to update plans')
        return null
      }

      try {
        const response = await fetch(`/api/plans/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        })

        if (response.status === 401) {
          setIsAuthenticated(false)
          setError('Please sign in to update plans')
          return null
        }

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
    [isAuthenticated]
  )

  const deletePlan = useCallback(
    async (id: string): Promise<boolean> => {
      if (!isAuthenticated) {
        setError('Please sign in to delete plans')
        return false
      }

      try {
        const response = await fetch(`/api/plans/${id}`, {
          method: 'DELETE'
        })

        if (response.status === 401) {
          setIsAuthenticated(false)
          setError('Please sign in to delete plans')
          return false
        }

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
    [isAuthenticated]
  )

  return {
    plans,
    isLoading,
    error,
    isAuthenticated,
    createPlan,
    updatePlan,
    deletePlan,
    refetch: fetchPlans
  }
}
