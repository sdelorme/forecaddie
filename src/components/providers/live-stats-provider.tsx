'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Leaderboard, LeaderboardPlayer, LeaderboardEvent } from '@/types/leaderboard'

interface LiveStatsContextValue {
  players: Leaderboard['players']
  eventInfo: Leaderboard['eventInfo']
  loading: boolean
  error: string | null
}

const LiveStatsContext = createContext<LiveStatsContextValue | undefined>(undefined)

interface LiveStatsProviderProps {
  children: React.ReactNode
  initialData?: Leaderboard
}

const defaultEventInfo: LeaderboardEvent = {
  eventName: '',
  course: '',
  lastUpdated: '',
  currentRound: null
}

export function LiveStatsProvider({ children, initialData }: LiveStatsProviderProps) {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>(initialData?.players || [])
  const [eventInfo, setEventInfo] = useState<LeaderboardEvent>(initialData?.eventInfo || defaultEventInfo)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setPlayers(initialData.players)
      setEventInfo(initialData.eventInfo)
      setLoading(false)
    }
  }, [initialData])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/live-stats')
      if (!response.ok) {
        throw new Error('Failed to fetch live stats')
      }
      const data = await response.json()
      setPlayers(data.players)
      setEventInfo(data.eventInfo)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch live stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialData) {
      fetchData()
    }
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Poll every 5 minutes
    return () => clearInterval(interval)
  }, [fetchData, initialData])

  const value = {
    players,
    eventInfo,
    loading,
    error
  }

  return <LiveStatsContext.Provider value={value}>{children}</LiveStatsContext.Provider>
}

export const useLiveStats = () => {
  const context = useContext(LiveStatsContext)
  if (!context) {
    throw new Error('useLiveStats must be used within a LiveStatsProvider')
  }
  return context
}
