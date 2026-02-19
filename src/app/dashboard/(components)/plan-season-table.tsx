'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import { Check, Trophy, Circle, ChevronRight, ExternalLink } from 'lucide-react'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'
import type { PriorYearTopFinishers } from '../types'

interface PlanSeasonTableProps {
  events: ProcessedTourEvent[]
  picks: Pick[]
  players: Player[]
  earningsMap: Record<string, Record<number, number>>
  priorYearResults: Record<string, PriorYearTopFinishers>
  onOpenPicker: (eventId: string) => void
}

const statusConfig: Record<
  ProcessedTourEvent['tournamentType'],
  { label: string; className: string; dotClass: string }
> = {
  live: {
    label: 'Live',
    className: 'text-green-400',
    dotClass: 'fill-green-400 text-green-400'
  },
  future: {
    label: 'Upcoming',
    className: 'text-blue-400',
    dotClass: 'fill-blue-400 text-blue-400'
  },
  historical: {
    label: 'Completed',
    className: 'text-gray-500',
    dotClass: 'fill-gray-500 text-gray-500'
  }
}

function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

function formatShortName(name: string): string {
  const [lastName, firstName] = name.split(', ')
  if (!firstName) return name
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
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount.toLocaleString('en-US')}`
}

function getPickForEvent(
  eventId: string,
  picks: Pick[],
  players: Player[]
): { pick: Pick | undefined; player: Player | undefined } {
  const pick = picks.find((p) => p.event_id === eventId)
  if (!pick || pick.player_dg_id == null) return { pick, player: undefined }
  const player = players.find((p) => p.dgId === pick.player_dg_id)
  return { pick, player }
}

export function PlanSeasonTable({
  events,
  picks,
  players,
  earningsMap,
  priorYearResults,
  onOpenPicker
}: PlanSeasonTableProps) {
  if (events.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-500">No events found for this season.</p>
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 border-gray-700 hover:bg-transparent">
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider w-[280px] min-w-[240px]">
                Event
              </TableHead>
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider text-center w-[80px]">
                Date
              </TableHead>
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider min-w-[320px]">
                Prior Year Top 5
              </TableHead>
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider text-right min-w-[200px]">
                Your Pick
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-700/50">
            {events.map((event) => {
              const { pick, player } = getPickForEvent(event.eventId, picks, players)
              const hasPick = pick && pick.player_dg_id != null
              const isCompleted = event.isComplete
              const status = statusConfig[event.tournamentType]
              const prior = priorYearResults[event.eventId]
              const earnings =
                hasPick && pick?.player_dg_id != null ? (earningsMap[event.eventId]?.[pick.player_dg_id] ?? null) : null

              return (
                <TableRow
                  key={event.eventId}
                  className={cn(
                    'bg-gray-800/50 border-gray-700/50 transition-colors',
                    isCompleted && 'opacity-75',
                    isCompleted && hasPick && 'opacity-100'
                  )}
                >
                  {/* Event column */}
                  <TableCell className="py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Circle className={cn('h-2 w-2 flex-shrink-0', status.dotClass)} />
                        <span className="font-medium text-white text-sm leading-tight">{event.eventName}</span>
                      </div>
                      <p className="text-xs text-gray-500 pl-4">{event.course}</p>
                    </div>
                  </TableCell>

                  {/* Date column */}
                  <TableCell className="text-center text-sm text-gray-400 whitespace-nowrap">
                    {formatDate(event.startDate)}
                  </TableCell>

                  {/* Prior year top 5 column */}
                  <TableCell className="py-2">
                    {prior && prior.topFinishers.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
                        {prior.topFinishers.map((f, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-xs whitespace-nowrap">
                            {i === 0 && <Trophy className="h-3 w-3 text-yellow-400 flex-shrink-0" />}
                            <span
                              className={cn('tabular-nums', i === 0 ? 'text-yellow-400 font-medium' : 'text-gray-400')}
                            >
                              {i + 1}.
                            </span>
                            <span className={cn(i === 0 ? 'text-yellow-400 font-medium' : 'text-gray-300')}>
                              {formatShortName(f.playerName)}
                            </span>
                          </span>
                        ))}
                        <Link
                          href={`/events/${event.eventId}?year=${prior.year}`}
                          className="inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-primary transition-colors"
                          title={`Full ${prior.year} results`}
                        >
                          {prior.year}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </TableCell>

                  {/* Pick column */}
                  <TableCell className="text-right py-3">
                    {hasPick && player ? (
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isCompleted && <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />}
                            <span className="text-sm font-medium text-white">{player.displayName}</span>
                          </div>
                          {isCompleted && (
                            <div className="flex items-center justify-end gap-2 mt-0.5">
                              {pick?.result_position != null && (
                                <span
                                  className={cn(
                                    'text-xs font-medium',
                                    pick.result_position <= 3 ? 'text-yellow-400' : 'text-gray-400'
                                  )}
                                >
                                  {pick.result_position <= 3 && '🏆 '}
                                  {formatPosition(pick.result_position)}
                                </span>
                              )}
                              {earnings != null && (
                                <span className="text-xs font-medium text-green-400">{formatEarnings(earnings)}</span>
                              )}
                            </div>
                          )}
                        </div>
                        {!isCompleted && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenPicker(event.eventId)}
                            className="h-7 w-7 p-0 text-gray-500 hover:text-white"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ) : isCompleted ? (
                      <span className="text-xs text-gray-600">No pick</span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenPicker(event.eventId)}
                        className="h-8 text-xs border-gray-600 text-gray-300 hover:text-white hover:border-primary hover:bg-primary/10"
                      >
                        Select Pick
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
