import { notFound } from 'next/navigation'
import { getSchedule } from '@/lib/api/datagolf'
import { getHistoricalEventResults } from '@/lib/api/datagolf/queries/historical-events'
import { getFieldUpdates } from '@/lib/api/datagolf/queries/field-updates'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { PlayerEventFinish } from '@/types/historical-events'
import type { FieldUpdate } from '@/types/field-updates'

type EventDetailProps = {
  params: Promise<{
    'dg-event-id': string
  }>
}

function isValidEventId(id: string): boolean {
  return /^\d+$/.test(id)
}

function formatEarnings(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

function CompletedEventResults({ results, event }: { results: PlayerEventFinish[]; event: ProcessedTourEvent }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Completed</span>
        {event.winner && event.winner !== 'TBD' && (
          <span className="text-sm text-gray-400">
            Winner: <span className="text-white font-medium">{event.winner}</span>
          </span>
        )}
      </div>

      {results.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Results not yet available for this event.</p>
      ) : (
        <div className="bg-gray-800/50 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50 text-gray-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 w-16">Pos</th>
                <th className="text-left px-4 py-3">Player</th>
                <th className="text-right px-4 py-3">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {results.map((player, idx) => (
                <tr
                  key={`${player.dgId}-${idx}`}
                  className={cn(
                    'border-b border-gray-700/30',
                    player.status === 'cut' && 'text-gray-500',
                    player.status === 'wd' && 'text-orange-400/70',
                    player.status === 'dq' && 'text-red-400/70'
                  )}
                >
                  <td className="px-4 py-2.5 font-mono text-xs">{player.finishText}</td>
                  <td className="px-4 py-2.5">
                    <Link href={`/players/${player.dgId}`} className="hover:text-primary transition-colors">
                      {player.playerName}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-400">
                    {player.earnings ? formatEarnings(player.earnings) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function UpcomingEventField({ fieldData }: { fieldData: FieldUpdate }) {
  const professionals = fieldData.players.filter((p) => !p.isAmateur)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Upcoming</span>
        <span className="text-sm text-gray-400">{professionals.length} players in field</span>
      </div>

      <div className="bg-gray-800/50 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700/50 text-gray-400 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3">Player</th>
              <th className="text-left px-4 py-3">Tee Time</th>
              <th className="text-left px-4 py-3">Wave</th>
              <th className="text-center px-4 py-3">Start</th>
            </tr>
          </thead>
          <tbody>
            {professionals.map((player, idx) => (
              <tr key={`${player.dgId}-${idx}`} className="border-b border-gray-700/30">
                <td className="px-4 py-2.5">
                  <Link href={`/players/${player.dgId}`} className="hover:text-primary transition-colors text-white">
                    {player.playerName}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-gray-400">{player.teeTime ?? '—'}</td>
                <td className="px-4 py-2.5">
                  {player.wave ? (
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded',
                        player.wave === 'early' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      )}
                    >
                      {player.wave === 'early' ? 'Early' : 'Late'}
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-center text-gray-400 text-xs">
                  {player.startHole ? `Hole ${player.startHole}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UpcomingEventEmpty() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Upcoming</span>
      </div>
      <p className="text-gray-400 text-center py-8">Field not yet available — check back closer to the tournament.</p>
    </div>
  )
}

export default async function EventDetailPage({ params }: EventDetailProps) {
  const resolvedParams = await params
  const eventId = resolvedParams['dg-event-id']

  if (!isValidEventId(eventId)) {
    notFound()
  }

  const schedule = await getSchedule()
  const event = schedule.find((e) => e.eventId === eventId)

  if (!event) {
    notFound()
  }

  if (event.tournamentType === 'live') {
    const { redirect } = await import('next/navigation')
    redirect('/events/live-stats')
  }

  const isCompleted = event.tournamentType === 'historical'
  const currentYear = new Date().getFullYear()

  let results: PlayerEventFinish[] = []
  let fieldData: FieldUpdate | null = null

  if (isCompleted) {
    results = await getHistoricalEventResults(Number(eventId), currentYear)
  } else {
    fieldData = await getFieldUpdates()
    // Only use field data if it matches the event we're looking at
    if (fieldData && !fieldData.eventName.toLowerCase().includes(event.eventName.toLowerCase().split(' ')[0])) {
      fieldData = null
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/events" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
          &larr; Back to Schedule
        </Link>
        <h1 className="text-2xl font-bold text-white">{event.eventName}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
          <span>{event.course}</span>
          {event.location && <span>{event.location}</span>}
          <span>{event.startDate}</span>
        </div>
      </div>

      {isCompleted ? (
        <CompletedEventResults results={results} event={event} />
      ) : fieldData ? (
        <UpcomingEventField fieldData={fieldData} />
      ) : (
        <UpcomingEventEmpty />
      )}
    </main>
  )
}
