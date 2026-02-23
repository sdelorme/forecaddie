'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePicks } from '@/lib/supabase'
import { PlanHeader } from '@/app/dashboard/(components)/plan-header'
import { PlanEventList } from '@/app/dashboard/(components)/plan-event-list'
import { PlanPlayerTable } from '@/app/dashboard/(components)/plan-player-table'
import { PlanSeasonTable } from '@/app/dashboard/(components)/plan-season-table'
import { PickDialog } from '@/app/dashboard/(components)/pick-dialog'
import {
  ToggleGroup,
  ToggleGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'
import { getPurseForEvent } from '@/data/tournament-purses'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import type { HistoricalEventEntry, PlayerEventFinish } from '@/types/historical-events'
import type { FieldUpdate } from '@/types/field-updates'
import type { PriorYearTopFinishers, EventOddsFavorites } from '@/app/dashboard/types'
import type { RecentFormMap } from '@/types/hottest-golfers'
import { LayoutGrid, List, Loader2, TableProperties } from 'lucide-react'

type ViewMode = 'table' | 'list' | 'grid'
type EventSort = 'date' | 'purse-asc' | 'purse-desc'

interface PlanDetailClientProps {
  planId: string
  planName: string
  season: number
  events: ProcessedTourEvent[]
  players: Player[]
  historicalEvents: HistoricalEventEntry[]
  earningsMap: Record<string, Record<number, number>>
  priorYearResults: Record<string, PriorYearTopFinishers>
  oddsFavorites: EventOddsFavorites | null
  recentForm: RecentFormMap
  canInvite: boolean
  currentUserId: string
}

export function PlanDetailClient({
  planId,
  planName,
  season,
  events,
  players,
  historicalEvents,
  earningsMap,
  priorYearResults,
  oddsFavorites,
  recentForm,
  canInvite,
  currentUserId
}: PlanDetailClientProps) {
  const {
    picks,
    isLoading: picksLoading,
    error,
    createPick,
    updatePick,
    getPickForEvent,
    getPicksForEvent,
    getUsedPlayerIds
  } = usePicks(planId)

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [eventSort, setEventSort] = useState<EventSort>('date')
  const [pickDialogOpen, setPickDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<1 | 2 | 3>(1)
  const [historicalFinishes, setHistoricalFinishes] = useState<Map<number, PlayerEventFinish[]>>(new Map())
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [fieldData, setFieldData] = useState<FieldUpdate | null>(null)

  const latestEventRef = useRef<string | null>(null)

  const proPlayers = useMemo(() => players.filter((p) => p.amateur === 0), [players])

  const seasonEvents = useMemo(() => {
    const filtered = events.filter((e) => e.startDate.startsWith(String(season)))
    if (eventSort === 'date') {
      return [...filtered].sort((a, b) => a.startDate.localeCompare(b.startDate))
    }
    const purseA = (e: ProcessedTourEvent) => getPurseForEvent(e.eventId, e.eventName) ?? -1
    const purseB = (e: ProcessedTourEvent) => getPurseForEvent(e.eventId, e.eventName) ?? -1
    return [...filtered].sort((a, b) => {
      const pa = purseA(a)
      const pb = purseB(b)
      if (eventSort === 'purse-asc') return pa - pb
      return pb - pa
    })
  }, [events, season, eventSort])

  const usedPlayerIds = useMemo(() => getUsedPlayerIds(), [getUsedPlayerIds])

  const futurePickEventNames = useMemo(() => {
    if (!selectedEventId) return new Map<number, string>()
    const selected = seasonEvents.find((e) => e.eventId === selectedEventId)
    if (!selected) return new Map<number, string>()
    const futureEvents = seasonEvents.filter((e) => e.startDate > selected.startDate)
    const map = new Map<number, string>()
    for (const ev of futureEvents) {
      const pick = picks.find((p) => p.event_id === ev.eventId && p.slot === 1 && p.player_dg_id != null)
      if (!pick) continue
      if (!map.has(pick.player_dg_id!)) {
        map.set(pick.player_dg_id!, ev.eventName)
      }
    }
    return map
  }, [picks, seasonEvents, selectedEventId])

  const eventPicks = useMemo(
    () =>
      selectedEventId
        ? getPicksForEvent(selectedEventId)
        : { locked: undefined, option1: undefined, option2: undefined },
    [getPicksForEvent, selectedEventId]
  )

  const currentPick = useMemo(
    () => (editingSlot === 1 ? eventPicks.locked : editingSlot === 2 ? eventPicks.option1 : eventPicks.option2),
    [editingSlot, eventPicks]
  )

  const consideredPlayerIds = useMemo(() => {
    const ids: number[] = []
    if (eventPicks.option1?.player_dg_id != null) ids.push(eventPicks.option1.player_dg_id)
    if (eventPicks.option2?.player_dg_id != null) ids.push(eventPicks.option2.player_dg_id)
    if (currentPick?.player_dg_id != null) {
      return ids.filter((id) => id !== currentPick!.player_dg_id)
    }
    return ids
  }, [eventPicks, currentPick])

  const selectedEventName = useMemo(() => {
    if (!selectedEventId) return undefined
    return seasonEvents.find((e) => e.eventId === selectedEventId)?.eventName
  }, [selectedEventId, seasonEvents])

  const historicalYears = useMemo(() => {
    if (!selectedEventId) return []
    const numericId = Number(selectedEventId)
    return historicalEvents
      .filter((e) => e.eventId === numericId && e.calendarYear < season)
      .map((e) => e.calendarYear)
      .sort((a, b) => b - a)
      .slice(0, 3)
  }, [selectedEventId, historicalEvents, season])

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

  useEffect(() => {
    if (!selectedEventId) {
      setFieldData(null)
      return
    }

    let cancelled = false
    fetch('/api/field-updates')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: FieldUpdate | null) => {
        if (cancelled) return
        if (!data) {
          setFieldData(null)
          return
        }
        const eventName = seasonEvents.find((e) => e.eventId === selectedEventId)?.eventName ?? ''
        const firstWord = eventName.toLowerCase().split(' ')[0]
        const matches = firstWord && data.eventName.toLowerCase().includes(firstWord)
        setFieldData(matches ? data : null)
      })
      .catch(() => {
        if (!cancelled) setFieldData(null)
      })

    return () => {
      cancelled = true
    }
  }, [selectedEventId, seasonEvents])

  const withdrawnPlayerIds = useMemo(() => {
    if (!fieldData) return new Set<number>()
    return new Set<number>()
  }, [fieldData])

  const handleSelectPlayer = async (playerDgId: number, slot: 1 | 2 | 3 = 1) => {
    if (!selectedEventId) return

    const pickForSlot = slot === 1 ? eventPicks.locked : slot === 2 ? eventPicks.option1 : eventPicks.option2
    if (pickForSlot) {
      await updatePick(pickForSlot.id, playerDgId, slot)
    } else {
      await createPick(selectedEventId, playerDgId, slot)
    }
  }

  const handleClearPick = async (pick: { id: string }) => {
    await updatePick(pick.id, null)
  }

  const handleOpenPicker = (eventId: string) => {
    setSelectedEventId(eventId)
    setPickDialogOpen(true)
  }

  const handleSelectEventForList = (eventId: string) => {
    setSelectedEventId(eventId)
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
      futurePickEventNames={futurePickEventNames}
      onSelectPlayer={(playerDgId) => handleSelectPlayer(playerDgId, 1)}
      onClearPick={() => currentPick && handleClearPick(currentPick)}
      currentPick={currentPick}
      selectedEventId={selectedEventId ?? undefined}
      selectedEventName={selectedEventName}
      historicalYears={historicalYears}
      historicalFinishes={historicalFinishes}
      isLoadingHistory={isLoadingHistory}
      withdrawnPlayerIds={withdrawnPlayerIds}
      editingSlot={1}
      consideredPlayerIds={consideredPlayerIds}
      recentForm={recentForm}
      readOnly={!canInvite}
    />
  ) : (
    <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
      <p className="text-gray-500">Select an event to assign a player</p>
    </div>
  )

  return (
    <div>
      <PlanHeader
        planId={planId}
        planName={planName}
        season={season}
        pickCount={picks.filter((p) => p.slot === 1 && p.player_dg_id != null).length}
        totalEvents={seasonEvents.length}
        canInvite={canInvite}
        currentUserId={currentUserId}
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700 px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-end gap-4">
        <Select value={eventSort} onValueChange={(v) => setEventSort(v as EventSort)}>
          <SelectTrigger className="w-[140px] h-8 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="purse-desc">Purse (high → low)</SelectItem>
            <SelectItem value="purse-asc">Purse (low → high)</SelectItem>
          </SelectContent>
        </Select>
        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)} size="sm">
          <ToggleGroupItem value="table" aria-label="Table view">
            <TableProperties className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'table' ? (
        <PlanSeasonTable
          events={seasonEvents}
          getPicksForEvent={getPicksForEvent}
          players={proPlayers}
          earningsMap={earningsMap}
          priorYearResults={priorYearResults}
          oddsFavorites={oddsFavorites}
          onOpenPicker={handleOpenPicker}
        />
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PlanEventList
              events={seasonEvents}
              picks={picks}
              players={proPlayers}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEventForList}
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
            onSelectEvent={handleSelectEventForList}
            viewMode={viewMode}
            earningsMap={earningsMap}
          />
          {playerTable}
        </div>
      )}

      <PickDialog
        open={pickDialogOpen}
        onOpenChange={setPickDialogOpen}
        eventName={selectedEventName}
        selectedEventId={selectedEventId ?? undefined}
        players={proPlayers}
        usedPlayerIds={usedPlayerIds}
        futurePickEventNames={futurePickEventNames}
        eventPicks={eventPicks}
        historicalYears={historicalYears}
        historicalFinishes={historicalFinishes}
        isLoadingHistory={isLoadingHistory}
        withdrawnPlayerIds={withdrawnPlayerIds}
        recentForm={recentForm}
        onSelectPlayer={handleSelectPlayer}
        onClearPick={handleClearPick}
        readOnly={!canInvite}
      />
    </div>
  )
}
