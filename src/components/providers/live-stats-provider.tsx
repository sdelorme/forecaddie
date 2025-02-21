'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getLiveLeaderboard } from '@/data/fetch-live-leaderboard'
import type { Leaderboard } from '@/types/leaderboard'

interface LiveStatsContextValue {
  players: Leaderboard['players']
  eventInfo: Leaderboard['eventInfo']
  loading: boolean
  error: string | null
}

const LiveStatsContext = createContext<LiveStatsContextValue | undefined>(
  undefined
)

export const LiveStatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [players, setPlayers] = useState<Leaderboard['players']>([])
  const [eventInfo, setEventInfo] = useState<Leaderboard['eventInfo']>({
    eventName: '',
    course: '',
    lastUpdated: '',
    currentRound: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { players, eventInfo } = await getLiveLeaderboard()
        setPlayers(players)
        setEventInfo(eventInfo)
      } catch (err) {
        console.error('Error fetching live stats:', err)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <LiveStatsContext.Provider value={{ players, eventInfo, loading, error }}>
      {children}
    </LiveStatsContext.Provider>
  )
}

export const useLiveStats = () => {
  const context = useContext(LiveStatsContext)
  if (!context) {
    throw new Error('useLiveStats must be used within a LiveStatsProvider')
  }
  return context
}
