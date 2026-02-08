'use client'

import { cn } from '@/lib/utils'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'

interface PlanEventListProps {
  events: ProcessedTourEvent[]
  picks: Pick[]
  players: Player[]
  selectedEventId: string | null
  onSelectEvent: (eventId: string) => void
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

function formatShortName(player: Player): string {
  const [lastName, firstName] = player.playerName.split(', ')
  if (!firstName) return player.displayName
  return `${firstName[0]}. ${lastName}`
}

function getPickDisplay(eventId: string, picks: Pick[], players: Player[]): { text: string; muted: boolean } {
  const pick = picks.find((p) => p.event_id === eventId)
  if (!pick) return { text: '—', muted: true }
  if (pick.player_dg_id == null) {
    return { text: 'No player selected', muted: true }
  }
  const player = players.find((p) => p.dgId === pick.player_dg_id)
  const name = player ? formatShortName(player) : `Player #${pick.player_dg_id}`
  return { text: name, muted: false }
}

export function PlanEventList({ events, picks, players, selectedEventId, onSelectEvent }: PlanEventListProps) {
  if (events.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-500">No events found for this season.</p>
  }

  return (
    <div className="max-h-[calc(100vh-16rem)] space-y-2 overflow-y-auto pr-1">
      {events.map((event) => {
        const isSelected = selectedEventId === event.eventId
        const badge = tournamentBadge[event.tournamentType]
        const pickDisplay = getPickDisplay(event.eventId, picks, players)
        const isCompletedWithPick = event.isComplete && picks.some((p) => p.event_id === event.eventId)

        return (
          <button
            key={event.eventId}
            type="button"
            onClick={() => onSelectEvent(event.eventId)}
            className={cn(
              'w-full cursor-pointer rounded-lg border p-4 text-left transition-all duration-200',
              'hover:bg-gray-700/50',
              isSelected ? 'border-green-600 bg-green-900/20' : 'border-gray-700/50 bg-gray-800',
              isCompletedWithPick && 'opacity-75'
            )}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
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
              </div>

              <span className={cn('flex-shrink-0 text-sm', pickDisplay.muted ? 'text-gray-500' : 'text-white')}>
                {pickDisplay.text}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
