'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePicks } from '@/lib/supabase'
import { PlanHeader } from '@/app/dashboard/(components)/plan-header'
import { PlanEventList } from '@/app/dashboard/(components)/plan-event-list'
import { PlanPlayerTable } from '@/app/dashboard/(components)/plan-player-table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import type { HistoricalEventEntry, PlayerEventFinish } from '@/types/historical-events'
import { LayoutGrid, List, Loader2 } from 'lucide-react'

interface PlanDetailClientProps {
  planId: string
  planName: string
  season: number
  events: ProcessedTourEvent[]
  players: Player[]
  historicalEvents: HistoricalEventEntry[]
  earningsMap: Record<string, Record<number, number>>
}

export function PlanDetailClient({
  planId,
  planName,
  season,
  events,
  players,
  historicalEvents,
  earningsMap
}: PlanDetailClientProps) {
  const {
    picks,
    isLoading: picksLoading,
    error,
    createPick,
    updatePick,
    getPickForEvent,
    getUsedPlayerIds
  } = usePicks(planId)

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [historicalFinishes, setHistoricalFinishes] = useState<Map<number, PlayerEventFinish[]>>(new Map())
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Ref to track the latest selected event for stale-fetch prevention
  const latestEventRef = useRef<string | null>(null)

  // Exclude amateurs — amateur === 0 means professional
  const proPlayers = useMemo(() => players.filter((p) => p.amateur === 0), [players])

  const seasonEvents = useMemo(() => events.filter((e) => e.startDate.startsWith(String(season))), [events, season])

  const usedPlayerIds = useMemo(() => getUsedPlayerIds(), [getUsedPlayerIds])

  const currentPick = selectedEventId ? getPickForEvent(selectedEventId) : undefined

  const selectedEventName = useMemo(() => {
    if (!selectedEventId) return undefined
    return seasonEvents.find((e) => e.eventId === selectedEventId)?.eventName
  }, [selectedEventId, seasonEvents])

  // Compute the 3 most recent prior years for the selected event
  const historicalYears = useMemo(() => {
    if (!selectedEventId) return []
    const numericId = Number(selectedEventId)
    return historicalEvents
      .filter((e) => e.eventId === numericId && e.calendarYear < season)
      .map((e) => e.calendarYear)
      .sort((a, b) => b - a)
      .slice(0, 3)
  }, [selectedEventId, historicalEvents, season])

  // Fetch historical results when event/years change
  const fetchHistoricalResults = useCallback(async (eventId: string, years: number[]) => {
    if (years.length === 0) {
      setHistoricalFinishes(new Map())
      return
    }

    setIsLoadingHistory(true)
    try {
      const responses = await Promise.all(
        years.map((year) =>
          fetch(`/api/historical-events/${eventId}/${year}`)
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => [])
        )
      )

      // Only update if this is still the selected event
      if (latestEventRef.current !== eventId) return

      const map = new Map<number, PlayerEventFinish[]>()
      years.forEach((year, i) => {
        const data = responses[i]
        map.set(year, Array.isArray(data) ? data : [])
      })
      setHistoricalFinishes(map)
    } finally {
      if (latestEventRef.current === eventId) {
        setIsLoadingHistory(false)
      }
    }
  }, [])

  useEffect(() => {
    latestEventRef.current = selectedEventId
    if (!selectedEventId) {
      setHistoricalFinishes(new Map())
      setIsLoadingHistory(false)
      return
    }
    fetchHistoricalResults(selectedEventId, historicalYears)
  }, [selectedEventId, historicalYears, fetchHistoricalResults])

  const handleSelectPlayer = async (playerDgId: number) => {
    if (!selectedEventId) return

    const existing = getPickForEvent(selectedEventId)
    if (existing) {
      await updatePick(existing.id, playerDgId)
    } else {
      await createPick(selectedEventId, playerDgId)
    }
  }

  const handleClearPick = async () => {
    if (!currentPick) return
    await updatePick(currentPick.id, null)
  }

  if (picksLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-gray-400 mt-4">Loading picks...</p>
      </div>
    )
  }

  const playerTable = selectedEventId ? (
    <PlanPlayerTable
      players={proPlayers}
      usedPlayerIds={usedPlayerIds}
      onSelectPlayer={handleSelectPlayer}
      onClearPick={handleClearPick}
      currentPick={currentPick}
      selectedEventName={selectedEventName}
      historicalYears={historicalYears}
      historicalFinishes={historicalFinishes}
      isLoadingHistory={isLoadingHistory}
    />
  ) : (
    <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
      <p className="text-gray-500">Select an event to assign a player</p>
    </div>
  )

  return (
    <div>
      <PlanHeader
        planName={planName}
        season={season}
        pickCount={picks.filter((p) => p.player_dg_id != null).length}
        totalEvents={seasonEvents.length}
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700 px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && setViewMode(v as 'list' | 'grid')}
          size="sm"
        >
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PlanEventList
              events={seasonEvents}
              picks={picks}
              players={proPlayers}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
              viewMode={viewMode}
              earningsMap={earningsMap}
            />
          </div>
          <div className="lg:col-span-2">{playerTable}</div>
        </div>
      ) : (
        <div className="space-y-6">
          <PlanEventList
            events={seasonEvents}
            picks={picks}
            players={proPlayers}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
            viewMode={viewMode}
            earningsMap={earningsMap}
          />
          {playerTable}
        </div>
      )}
    </div>
  )
}
