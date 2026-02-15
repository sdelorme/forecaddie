'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import { CalendarCheck, Trophy } from 'lucide-react'
import type { CompletedEventResult } from '../types'

interface SeasonResultsTableProps {
  events: CompletedEventResult[]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider text-center" colSpan={3}>
                Top Finishers
              </TableHead>
              <TableHead className="text-gray-400 text-xs uppercase tracking-wider text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-700">
            {sorted.map((event) => {
              const f = event.topFinishers
              return (
                <TableRow
                  key={event.eventId}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  <TableCell className="font-medium text-white">{event.eventName}</TableCell>
                  {[0, 1, 2].map((i) => (
                    <TableCell key={i}>
                      {f[i] ? (
                        <span className="inline-flex items-center gap-1.5">
                          {i === 0 && <Trophy className="h-3.5 w-3.5 text-yellow-400" />}
                          <span className={i === 0 ? 'font-semibold text-yellow-400' : 'text-gray-300'}>
                            {f[i].playerName}
                          </span>
                          <span className="text-gray-500 text-xs">({f[i].finishText})</span>
                        </span>
                      ) : (
                        <span className="text-gray-600">&mdash;</span>
                      )}
                    </TableCell>
                  ))}
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
