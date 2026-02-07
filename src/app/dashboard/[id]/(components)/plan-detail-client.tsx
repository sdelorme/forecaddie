'use client'

import { useMemo, useState } from 'react'
import { usePicks } from '@/lib/supabase'
import { PlanHeader } from '@/app/dashboard/(components)/plan-header'
import { PlanEventList } from '@/app/dashboard/(components)/plan-event-list'
import { PlanPlayerTable } from '@/app/dashboard/(components)/plan-player-table'
import { PlanPastResults } from '@/app/dashboard/(components)/plan-past-results'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import { Loader2 } from 'lucide-react'

interface PlanDetailClientProps {
  planId: string
  planName: string
  season: number
  events: ProcessedTourEvent[]
  players: Player[]
}

export function PlanDetailClient({ planId, planName, season, events, players }: PlanDetailClientProps) {
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

  const seasonEvents = useMemo(() => events.filter((e) => e.startDate.startsWith(String(season))), [events, season])

  const upcomingEvents = useMemo(() => seasonEvents.filter((e) => !e.isComplete), [seasonEvents])

  const completedEvents = useMemo(() => seasonEvents.filter((e) => e.isComplete), [seasonEvents])

  const usedPlayerIds = useMemo(() => getUsedPlayerIds(), [getUsedPlayerIds])

  const currentPick = selectedEventId ? getPickForEvent(selectedEventId) : undefined

  const selectedEventName = useMemo(() => {
    if (!selectedEventId) return undefined
    return seasonEvents.find((e) => e.eventId === selectedEventId)?.eventName
  }, [selectedEventId, seasonEvents])

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlanEventList
            events={upcomingEvents}
            picks={picks}
            players={players}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedEventId ? (
            <PlanPlayerTable
              players={players}
              usedPlayerIds={usedPlayerIds}
              onSelectPlayer={handleSelectPlayer}
              onClearPick={handleClearPick}
              currentPick={currentPick}
              selectedEventName={selectedEventName}
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
              <p className="text-gray-500">Select an event to assign a player</p>
            </div>
          )}
        </div>
      </div>

      {completedEvents.length > 0 && <PlanPastResults events={completedEvents} picks={picks} players={players} />}
    </div>
  )
}
