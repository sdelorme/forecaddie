'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import {
  Check,
  Trophy,
  Circle,
  ChevronRight,
  ExternalLink,
  UserRound,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { formatPurse } from '@/lib/utils'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'
import type { EventPicks } from '@/lib/supabase'
import type { PriorYearTopFinishers, EventOddsFavorites } from '../types'

interface PlanSeasonTableProps {
  events: ProcessedTourEvent[]
  getPicksForEvent: (eventId: string) => EventPicks
  players: Player[]
  earningsMap: Record<string, Record<number, number>>
  priorYearResults: Record<string, PriorYearTopFinishers>
  oddsFavorites: EventOddsFavorites | null
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

function getPickDisplay(
  eventPicks: EventPicks,
  players: Player[]
): {
  locked: { pick: Pick; player: Player } | undefined
  option1: { pick: Pick; player: Player } | undefined
  option2: { pick: Pick; player: Player } | undefined
} {
  const resolve = (pick: Pick | undefined) => {
    if (!pick || pick.player_dg_id == null) return undefined
    const player = players.find((p) => p.dgId === pick.player_dg_id)
    return player ? { pick, player } : undefined
  }
  return {
    locked: resolve(eventPicks.locked),
    option1: resolve(eventPicks.option1),
    option2: resolve(eventPicks.option2)
  }
}

function matchOddsEventId(oddsFavorites: EventOddsFavorites | null, events: ProcessedTourEvent[]): string | null {
  if (!oddsFavorites) return null
  const oddsName = oddsFavorites.eventName.toLowerCase()
  const exact = events.find((e) => e.eventName.toLowerCase() === oddsName)
  if (exact) return exact.eventId
  const partial = events.find((e) => {
    const first = e.eventName.toLowerCase().split(' ')[0]
    return first.length > 2 && oddsName.includes(first)
  })
  return partial?.eventId ?? null
}

type SortKey = 'date' | 'purse'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, direction }: { active: boolean; direction: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-50" />
  return direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
}

export function PlanSeasonTable({
  events,
  getPicksForEvent,
  players,
  earningsMap,
  priorYearResults,
  oddsFavorites,
  onOpenPicker
}: PlanSeasonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const oddsEventId = matchOddsEventId(oddsFavorites, events)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'purse' ? 'desc' : 'asc')
    }
  }

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      let cmp: number
      if (sortKey === 'purse') {
        cmp = (a.purse ?? -1) - (b.purse ?? -1)
      } else {
        cmp = a.startDate.localeCompare(b.startDate)
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
  }, [events, sortKey, sortDir])

  if (events.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-500">No events found for this season.</p>
  }

  return (
    <div className="rounded-lg border border-gray-700 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-800 border-gray-700 hover:bg-transparent">
            <TableHead className="text-gray-400 text-xs uppercase tracking-wider w-[240px] min-w-[200px]">
              Event
            </TableHead>
            <TableHead
              role="button"
              tabIndex={0}
              onClick={() => toggleSort('date')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleSort('date')
                }
              }}
              className="text-gray-400 text-xs uppercase tracking-wider text-center w-[72px] cursor-pointer hover:text-gray-300 transition-colors select-none"
            >
              <span className="inline-flex items-center gap-1">
                Date
                <SortIcon active={sortKey === 'date'} direction={sortDir} />
              </span>
            </TableHead>
            <TableHead
              role="button"
              tabIndex={0}
              onClick={() => toggleSort('purse')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleSort('purse')
                }
              }}
              className="text-gray-400 text-xs uppercase tracking-wider text-right w-[72px] cursor-pointer hover:text-gray-300 transition-colors select-none"
            >
              <span className="inline-flex items-center gap-1 justify-end">
                Purse
                <SortIcon active={sortKey === 'purse'} direction={sortDir} />
              </span>
            </TableHead>
            <TableHead className="text-gray-400 text-xs uppercase tracking-wider min-w-[200px]">Selected</TableHead>
            <TableHead className="text-gray-400 text-xs uppercase tracking-wider min-w-[320px]">
              Prior Year Top 5
            </TableHead>
            <TableHead className="text-gray-400 text-xs uppercase tracking-wider min-w-[280px]">
              Odds Favorites
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-700/50">
          {sortedEvents.map((event) => {
            const eventPicks = getPicksForEvent(event.eventId)
            const { locked, option1, option2 } = getPickDisplay(eventPicks, players)
            const purse = event.purse
            const hasLocked = !!locked
            const isCompleted = event.isComplete
            const status = statusConfig[event.tournamentType]
            const prior = priorYearResults[event.eventId]
            const earnings =
              hasLocked && locked?.pick.player_dg_id != null
                ? (earningsMap[event.eventId]?.[locked.pick.player_dg_id] ?? null)
                : null

            return (
              <TableRow
                key={event.eventId}
                role="button"
                tabIndex={0}
                onClick={() => onOpenPicker(event.eventId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onOpenPicker(event.eventId)
                  }
                }}
                className={cn(
                  'bg-gray-800/50 border-gray-700/50 transition-colors cursor-pointer hover:bg-gray-700/60',
                  isCompleted && !hasLocked && 'opacity-75',
                  isCompleted && hasLocked && 'opacity-100'
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

                {/* Purse column */}
                <TableCell className="text-right text-sm text-gray-400 whitespace-nowrap tabular-nums">
                  {purse != null ? formatPurse(purse) : '—'}
                </TableCell>

                {/* Selected pick column */}
                <TableCell className="py-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {hasLocked && locked ? (
                      <div
                        className={cn(
                          'inline-flex items-center gap-2 rounded-md px-3 py-1.5',
                          isCompleted
                            ? 'bg-green-900/30 border border-green-800/50'
                            : 'bg-primary/10 border border-primary/20'
                        )}
                      >
                        <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-white block truncate">
                            {locked.player.displayName}
                          </span>
                          {isCompleted && (locked.pick.result_position != null || earnings != null) && (
                            <span className="flex items-center gap-1.5 text-xs">
                              {locked.pick.result_position != null && (
                                <span
                                  className={cn(
                                    'font-medium',
                                    locked.pick.result_position <= 3 ? 'text-yellow-400' : 'text-gray-400'
                                  )}
                                >
                                  {formatPosition(locked.pick.result_position)}
                                </span>
                              )}
                              {earnings != null && (
                                <span className="font-medium text-green-400">{formatEarnings(earnings)}</span>
                              )}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      </div>
                    ) : (
                      <span
                        className="inline-flex items-center gap-2 rounded-md border border-dashed px-3 py-1.5 text-sm border-gray-600 text-gray-500 cursor-pointer hover:border-gray-500"
                        onClick={() => onOpenPicker(event.eventId)}
                      >
                        <UserRound className="h-3.5 w-3.5" />
                        Select pick
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {option1 && (
                      <span className="inline-flex items-center rounded-md bg-slate-600/30 border border-slate-500/50 px-2 py-1 text-xs text-slate-300">
                        {option1.player.displayName}
                      </span>
                    )}
                    {option2 && (
                      <span className="inline-flex items-center rounded-md bg-slate-600/30 border border-slate-500/50 px-2 py-1 text-xs text-slate-300">
                        {option2.player.displayName}
                      </span>
                    )}
                  </div>
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
                        onClick={(e) => e.stopPropagation()}
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

                {/* Odds favorites column */}
                <TableCell className="py-2">
                  {oddsEventId === event.eventId && oddsFavorites ? (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
                      {oddsFavorites.favorites.map((f, i) => (
                        <span key={f.dgId} className="inline-flex items-center gap-1 text-xs whitespace-nowrap">
                          <span
                            className={cn('tabular-nums', i === 0 ? 'text-green-400 font-medium' : 'text-gray-400')}
                          >
                            {i + 1}.
                          </span>
                          <span className={cn(i === 0 ? 'text-green-400 font-medium' : 'text-gray-300')}>
                            {formatShortName(f.playerName)}
                          </span>
                          <span className="text-gray-500 tabular-nums">{f.odds}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
