'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import { CalendarCheck, Trophy } from 'lucide-react'
import type { CompletedEventPodium } from '../types'

interface SeasonResultsTableProps {
  events: CompletedEventPodium[]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getPodiumPlayer(podium: CompletedEventPodium['podium'], position: number): string | null {
  const entry = podium.find((p) => p.position === position)
  return entry?.playerName ?? null
}

export function SeasonResultsTable({ events }: SeasonResultsTableProps) {
  const sorted = [...events].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  if (sorted.length === 0) {
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
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <CalendarCheck className="h-5 w-5" />
        Past Results
      </h2>
      <div className="overflow-hidden rounded-lg border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800 border-gray-700 hover:bg-transparent">
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider">Event</TableHead>
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider">1st</TableHead>
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider">2nd</TableHead>
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider">3rd</TableHead>
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-700">
            {sorted.map((event) => {
              const first = getPodiumPlayer(event.podium, 1)
              const second = getPodiumPlayer(event.podium, 2)
              const third = getPodiumPlayer(event.podium, 3)

              return (
                <TableRow
                  key={event.eventId}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="font-medium text-white">{event.eventName}</TableCell>
                  <TableCell>
                    {first ? (
                      <span className="inline-flex items-center gap-1.5 text-yellow-400 font-semibold">
                        <Trophy className="h-3.5 w-3.5" />
                        {first}
                      </span>
                    ) : (
                      <span className="text-gray-600">&mdash;</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-300">{second ?? '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-300">{third ?? '—'}</span>
                  </TableCell>
                  <TableCell className="text-gray-400 text-right">{formatDate(event.startDate)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
