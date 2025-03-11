'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Leaderboard } from '@/lib/api/datagolf'

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

export const LiveStatsProvider: React.FC<LiveStatsProviderProps> = ({ children, initialData }) => {
  const [players, setPlayers] = useState<Leaderboard['players']>(initialData?.players ?? [])
  const [eventInfo, setEventInfo] = useState<Leaderboard['eventInfo']>(
    initialData?.eventInfo ?? {
      eventName: '',
      course: '',
      lastUpdated: '',
      currentRound: null
    }
  )
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching live stats:', err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    // Only poll if we don't have initial data or if we want to refresh
    const interval = setInterval(fetchData, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <LiveStatsContext.Provider value={{ players, eventInfo, loading, error }}>{children}</LiveStatsContext.Provider>
  )
}

export const useLiveStats = () => {
  const context = useContext(LiveStatsContext)
  if (!context) {
    throw new Error('useLiveStats must be used within a LiveStatsProvider')
  }
  return context
}
