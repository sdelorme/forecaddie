'use client'

import { useMemo } from 'react'
import { Trophy, CalendarCheck } from 'lucide-react'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'

interface PlanPastResultsProps {
  events: ProcessedTourEvent[]
  picks: Pick[]
  players: Player[]
}

interface PastResultRow {
  eventId: string
  eventName: string
  startDate: string
  playerName: string | null
  resultPosition: number | null
  winner: string | null
  hasPick: boolean
}

function formatPosition(pos: number | null): string {
  if (pos === null) return '—'
  if (pos === 1) return '1st'
  if (pos === 2) return '2nd'
  if (pos === 3) return '3rd'
  return `T${pos}`
}

/** DataGolf returns winner as "Last, First (dg_id)" — strip the id and flip to "First Last" */
function formatWinnerName(raw: string): string {
  const clean = raw.replace(/\s*\(\d+\)/, '').trim()
  const parts = clean.split(', ')
  if (parts.length < 2) return clean
  return `${parts[1]} ${parts[0]}`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

export function PlanPastResults({ events, picks, players }: PlanPastResultsProps) {
  const pastResults = useMemo<PastResultRow[]>(() => {
    const completedEvents = events.filter((e) => e.isComplete || e.tournamentType === 'historical')

    return completedEvents
      .map((event) => {
        const pick = picks.find((p) => p.event_id === event.eventId && p.player_dg_id != null)
        const player = pick ? players.find((p) => p.dgId === pick.player_dg_id) : null

        return {
          eventId: event.eventId,
          eventName: event.eventName,
          startDate: event.startDate,
          playerName: player?.displayName ?? (pick ? 'Unknown' : null),
          resultPosition: pick?.result_position ?? null,
          winner: event.winner ? formatWinnerName(event.winner) : null,
          hasPick: !!pick
        }
      })
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
  }, [events, picks, players])

  if (pastResults.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-3">Past Results</h2>
        <div className="flex items-center gap-3 rounded-lg bg-gray-800 px-5 py-6 text-gray-500">
          <CalendarCheck className="h-5 w-5 shrink-0" />
          <p className="text-sm">No completed events yet this season.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-white mb-3">Past Results</h2>
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-gray-400 text-left text-xs uppercase tracking-wider">
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Pick</th>
              <th className="px-4 py-3 text-right">Result</th>
              <th className="px-4 py-3 text-right">Winner</th>
              <th className="px-4 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {pastResults.map((row) => (
              <tr
                key={row.eventId}
                className={
                  row.hasPick
                    ? 'bg-gray-800/50 hover:bg-gray-800 transition-colors'
                    : 'bg-gray-800/30 hover:bg-gray-800/50 transition-colors'
                }
              >
                <td className="px-4 py-3 text-white font-medium">{row.eventName}</td>
                <td className={row.hasPick ? 'px-4 py-3 text-gray-300' : 'px-4 py-3 text-gray-600 italic'}>
                  {row.hasPick ? row.playerName : 'No pick'}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.hasPick ? (
                    <span
                      className={
                        row.resultPosition !== null && row.resultPosition <= 3
                          ? 'inline-flex items-center gap-1 text-yellow-400 font-semibold'
                          : 'text-gray-300'
                      }
                    >
                      {row.resultPosition !== null && row.resultPosition <= 3 && <Trophy className="h-3.5 w-3.5" />}
                      {formatPosition(row.resultPosition)}
                    </span>
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-400">{row.winner ?? '—'}</td>
                <td className="px-4 py-3 text-right text-gray-400">{formatDate(row.startDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
