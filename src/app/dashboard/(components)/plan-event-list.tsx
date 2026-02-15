'use client'

import { cn } from '@/lib/utils'
import { Check, Trophy } from 'lucide-react'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'

interface PlanEventListProps {
  events: ProcessedTourEvent[]
  picks: Pick[]
  players: Player[]
  selectedEventId: string | null
  onSelectEvent: (eventId: string) => void
  viewMode: 'list' | 'grid'
  earningsMap: Record<string, Record<number, number>>
}

const tournamentBadge: Record<ProcessedTourEvent['tournamentType'], { label: string; className: string }> = {
  live: {
    label: 'Live',
    className: 'bg-green-500/20 text-green-400'
  },
  future: {
    label: 'Upcoming',
    className: 'bg-blue-500/20 text-blue-400'
  },
  historical: {
    label: 'Completed',
    className: 'bg-gray-500/20 text-gray-400'
  }
}

function formatEventDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

function formatShortDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

function formatShortName(player: Player): string {
  const [lastName, firstName] = player.playerName.split(', ')
  if (!firstName) return player.displayName
  return `${firstName[0]}. ${lastName}`
}

function formatPosition(pos: number | null): string {
  if (pos === null) return '—'
  if (pos === 1) return '1st'
  if (pos === 2) return '2nd'
  if (pos === 3) return '3rd'
  return `T${pos}`
}

function formatEarnings(amount: number): string {
  return '$' + amount.toLocaleString('en-US')
}

function getPickInfo(
  eventId: string,
  picks: Pick[],
  players: Player[]
): {
  text: string
  muted: boolean
  pick: Pick | undefined
  player: Player | undefined
} {
  const pick = picks.find((p) => p.event_id === eventId)
  if (!pick) return { text: '—', muted: true, pick: undefined, player: undefined }
  if (pick.player_dg_id == null) {
    return { text: 'No player selected', muted: true, pick, player: undefined }
  }
  const player = players.find((p) => p.dgId === pick.player_dg_id)
  const name = player ? formatShortName(player) : `Player #${pick.player_dg_id}`
  return { text: name, muted: false, pick, player }
}

function EventCardList({
  event,
  isSelected,
  pickInfo,
  earningsMap,
  onSelect
}: {
  event: ProcessedTourEvent
  isSelected: boolean
  pickInfo: ReturnType<typeof getPickInfo>
  earningsMap: Record<string, Record<number, number>>
  onSelect: () => void
}) {
  const badge = tournamentBadge[event.tournamentType]
  const isCompleted = event.isComplete
  const hasPick = pickInfo.pick && pickInfo.pick.player_dg_id != null
  const earnings =
    hasPick && pickInfo.pick?.player_dg_id != null
      ? (earningsMap[event.eventId]?.[pickInfo.pick.player_dg_id] ?? null)
      : null

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full cursor-pointer rounded-lg border p-4 text-left transition-all duration-200',
        'hover:bg-gray-700/50',
        isSelected ? 'border-green-600 bg-green-900/20' : 'border-gray-700/50 bg-gray-800',
        isCompleted && hasPick && 'border-l-green-600 border-l-2',
        isCompleted && !isSelected && 'opacity-80'
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            {isCompleted && hasPick && <Check className="h-4 w-4 flex-shrink-0 text-green-500" />}
            <h3 className="truncate font-semibold text-white">{event.eventName}</h3>
            <span className={cn('flex-shrink-0 rounded px-2 py-0.5 text-xs font-medium', badge.className)}>
              {badge.label}
            </span>
          </div>
          <p className="truncate text-sm text-gray-400">
            {event.course}
            {event.course && event.startDate ? ' · ' : ''}
            {formatEventDate(event.startDate)}
          </p>

          {isCompleted && hasPick && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm text-gray-300">{pickInfo.text}</span>
              {pickInfo.pick?.result_position != null && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
                    pickInfo.pick.result_position <= 3
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-600/30 text-gray-300'
                  )}
                >
                  {pickInfo.pick.result_position <= 3 && <Trophy className="h-3 w-3" />}
                  {formatPosition(pickInfo.pick.result_position)}
                </span>
              )}
              {earnings != null && (
                <span className="text-xs font-medium text-green-400">{formatEarnings(earnings)}</span>
              )}
            </div>
          )}
        </div>

        {!isCompleted && (
          <span className={cn('flex-shrink-0 text-sm', pickInfo.muted ? 'text-gray-500' : 'text-white')}>
            {pickInfo.text}
          </span>
        )}
      </div>
    </button>
  )
}

function EventCardGrid({
  event,
  isSelected,
  pickInfo,
  earningsMap,
  onSelect
}: {
  event: ProcessedTourEvent
  isSelected: boolean
  pickInfo: ReturnType<typeof getPickInfo>
  earningsMap: Record<string, Record<number, number>>
  onSelect: () => void
}) {
  const badge = tournamentBadge[event.tournamentType]
  const isCompleted = event.isComplete
  const hasPick = pickInfo.pick && pickInfo.pick.player_dg_id != null
  const earnings =
    hasPick && pickInfo.pick?.player_dg_id != null
      ? (earningsMap[event.eventId]?.[pickInfo.pick.player_dg_id] ?? null)
      : null

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex h-full w-full cursor-pointer flex-col rounded-lg border p-3 text-left transition-all duration-200',
        'hover:bg-gray-700/50',
        isSelected ? 'border-green-600 bg-green-900/20' : 'border-gray-700/50 bg-gray-800',
        isCompleted && hasPick && 'border-l-green-600 border-l-2',
        isCompleted && !isSelected && 'opacity-80'
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn('flex-shrink-0 rounded px-1.5 py-0.5 text-xs font-medium', badge.className)}>
          {badge.label}
        </span>
        <span className="text-xs text-gray-500">{formatShortDate(event.startDate)}</span>
      </div>

      <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-tight text-white">{event.eventName}</h3>

      <div className="mt-auto pt-2">
        {hasPick ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              {isCompleted && <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />}
              <span className="truncate text-xs text-gray-300">{pickInfo.text}</span>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-2">
                {pickInfo.pick?.result_position != null && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-xs font-medium',
                      pickInfo.pick.result_position <= 3 ? 'text-yellow-400' : 'text-gray-400'
                    )}
                  >
                    {pickInfo.pick.result_position <= 3 && <Trophy className="h-3 w-3" />}
                    {formatPosition(pickInfo.pick.result_position)}
                  </span>
                )}
                {earnings != null && (
                  <span className="text-xs font-medium text-green-400">{formatEarnings(earnings)}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-500">—</span>
        )}
      </div>
    </button>
  )
}

export function PlanEventList({
  events,
  picks,
  players,
  selectedEventId,
  onSelectEvent,
  viewMode,
  earningsMap
}: PlanEventListProps) {
  if (events.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-500">No events found for this season.</p>
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const isSelected = selectedEventId === event.eventId
          const pickInfo = getPickInfo(event.eventId, picks, players)

          return (
            <EventCardGrid
              key={event.eventId}
              event={event}
              isSelected={isSelected}
              pickInfo={pickInfo}
              earningsMap={earningsMap}
              onSelect={() => onSelectEvent(event.eventId)}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="max-h-[calc(100vh-16rem)] space-y-2 overflow-y-auto pr-1">
      {events.map((event) => {
        const isSelected = selectedEventId === event.eventId
        const pickInfo = getPickInfo(event.eventId, picks, players)

        return (
          <EventCardList
            key={event.eventId}
            event={event}
            isSelected={isSelected}
            pickInfo={pickInfo}
            earningsMap={earningsMap}
            onSelect={() => onSelectEvent(event.eventId)}
          />
        )
      })}
    </div>
  )
}
