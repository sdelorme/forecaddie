import { notFound, redirect } from 'next/navigation'
import { getSchedule, getLiveLeaderboard } from '@/lib/api/datagolf'
import { getHistoricalEventResults } from '@/lib/api/datagolf/queries/historical-events'
import { getHistoricalRawEventList, getHistoricalRawRounds } from '@/lib/api/datagolf/queries/historical-raw'
import { getFieldUpdates } from '@/lib/api/datagolf/queries/field-updates'
import { getPurseMap, attachPurses } from '@/lib/api/supabase/queries/tournament-purses'
import { cn, getToParColor, formatEarnings } from '@/lib/utils'
import { EventPurseClient } from '@/app/events/(components)/event-purse-client'
import { YearSelector } from '@/app/events/(components)/year-selector'
import Link from 'next/link'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Leaderboard } from '@/types/leaderboard'
import type { PlayerEventFinish } from '@/types/historical-events'
import type { HistoricalRawPlayerResult, RoundSummary } from '@/types/historical-raw'
import type { FieldUpdate } from '@/types/field-updates'

type EventDetailProps = {
  params: Promise<{
    'dg-event-id': string
  }>
  searchParams: Promise<{
    year?: string
  }>
}

function isValidEventId(id: string): boolean {
  return /^\d+$/.test(id)
}

function formatToPar(totalScore: number | null, totalPar: number | null): string {
  if (totalScore === null || totalPar === null) return '—'
  const diff = totalScore - totalPar
  if (diff === 0) return 'E'
  return diff > 0 ? `+${diff}` : String(diff)
}

function formatRoundScore(round: RoundSummary | null): string {
  if (!round) return '—'
  return String(round.score)
}

function CompletedEventResults({
  results,
  event,
  selectedYear
}: {
  results: PlayerEventFinish[]
  event: ProcessedTourEvent
  selectedYear?: number
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
          {selectedYear ? `${selectedYear} Results` : 'Completed'}
        </span>
        {!selectedYear && event.winner && event.winner !== 'TBD' && (
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

function RawEventResults({ results, selectedYear }: { results: HistoricalRawPlayerResult[]; selectedYear: number }) {
  const hasAnyR3 = results.some((p) => p.rounds[2] !== null)
  const hasAnyR4 = results.some((p) => p.rounds[3] !== null)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">{selectedYear} Results</span>
        {results.length > 0 && results[0].rounds[0] && (
          <span className="text-xs text-gray-500">{results[0].rounds[0].courseName}</span>
        )}
      </div>

      {results.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Results not yet available for this event.</p>
      ) : (
        <div className="bg-gray-800/50 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700/50 text-gray-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 w-16">Pos</th>
                <th className="text-left px-4 py-3">Player</th>
                <th className="text-center px-3 py-3 w-16">Score</th>
                <th className="text-center px-3 py-3 w-12">R1</th>
                <th className="text-center px-3 py-3 w-12">R2</th>
                {hasAnyR3 && <th className="text-center px-3 py-3 w-12">R3</th>}
                {hasAnyR4 && <th className="text-center px-3 py-3 w-12">R4</th>}
                <th className="text-center px-3 py-3 w-16">Total</th>
              </tr>
            </thead>
            <tbody>
              {results.map((player, idx) => {
                const toPar = formatToPar(player.totalScore, player.totalPar)
                const toParNum =
                  player.totalScore !== null && player.totalPar !== null ? player.totalScore - player.totalPar : null

                return (
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
                    <td className={cn('px-3 py-2.5 text-center font-medium tabular-nums', getToParColor(toParNum))}>
                      {toPar}
                    </td>
                    <td className="px-3 py-2.5 text-center tabular-nums text-gray-400">
                      {formatRoundScore(player.rounds[0])}
                    </td>
                    <td className="px-3 py-2.5 text-center tabular-nums text-gray-400">
                      {formatRoundScore(player.rounds[1])}
                    </td>
                    {hasAnyR3 && (
                      <td className="px-3 py-2.5 text-center tabular-nums text-gray-400">
                        {formatRoundScore(player.rounds[2])}
                      </td>
                    )}
                    {hasAnyR4 && (
                      <td className="px-3 py-2.5 text-center tabular-nums text-gray-400">
                        {formatRoundScore(player.rounds[3])}
                      </td>
                    )}
                    <td className="px-3 py-2.5 text-center tabular-nums text-gray-400">{player.totalScore ?? '—'}</td>
                  </tr>
                )
              })}
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

function LiveEventInProgress() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded animate-pulse">Live</span>
      </div>
      <p className="text-gray-400 text-center py-8">
        This tournament is in progress. Live leaderboard data is not available for this event.
      </p>
    </div>
  )
}

function leaderboardMatchesEvent(leaderboard: Leaderboard, event: ProcessedTourEvent): boolean {
  const lbName = leaderboard.eventInfo.eventName.toLowerCase()
  const evName = event.eventName.toLowerCase()
  return lbName.includes(evName) || evName.includes(lbName)
}

const EVENT_STATS_MIN_YEAR = 2025

export default async function EventDetailPage({ params, searchParams }: EventDetailProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const eventId = resolvedParams['dg-event-id']

  if (!isValidEventId(eventId)) {
    notFound()
  }

  const [rawSchedule, rawEventList] = await Promise.all([getSchedule(), getHistoricalRawEventList()])

  const season =
    rawSchedule.length > 0 ? new Date(rawSchedule[0].startDate + 'T00:00:00').getFullYear() : new Date().getFullYear()
  const purseMap = await getPurseMap(season)
  const schedule = attachPurses(rawSchedule, purseMap)
  const event = schedule.find((e) => e.eventId === eventId)

  if (!event) {
    notFound()
  }

  const numericEventId = Number(eventId)
  const availableYears = rawEventList
    .filter((e) => e.eventId === numericEventId)
    .map((e) => e.calendarYear)
    .sort((a, b) => b - a)

  const requestedYear = resolvedSearchParams.year ? Number(resolvedSearchParams.year) : null
  const isHistoricalYear = requestedYear !== null && !isNaN(requestedYear)
  const isLive = !isHistoricalYear && event.tournamentType === 'live'

  if (isLive) {
    const leaderboard = await getLiveLeaderboard()
    if (leaderboard.players.length > 0 && leaderboardMatchesEvent(leaderboard, event)) {
      redirect('/events/live-stats')
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/events" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
            &larr; Back to Schedule
          </Link>
          <h1 className="text-2xl font-bold text-white">{event.eventName}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
            <span>{event.course}</span>
            {event.location && <span>{event.location}</span>}
            <span>{event.startDate}</span>
            <EventPurseClient
              eventId={eventId}
              season={season}
              eventName={event.eventName}
              initialPurse={event.purse ?? null}
            />
          </div>
        </div>
        <LiveEventInProgress />
      </div>
    )
  }

  const isCompleted = event.tournamentType === 'historical' || isHistoricalYear
  const resultsYear = isHistoricalYear ? requestedYear : season

  let eventStatsResults: PlayerEventFinish[] = []
  let rawResults: HistoricalRawPlayerResult[] = []
  let fieldData: FieldUpdate | null = null

  if (isCompleted) {
    const [rawData, statsData] = await Promise.all([
      getHistoricalRawRounds(numericEventId, resultsYear),
      resultsYear >= EVENT_STATS_MIN_YEAR
        ? getHistoricalEventResults(numericEventId, resultsYear)
        : Promise.resolve([] as PlayerEventFinish[])
    ])
    rawResults = rawData
    eventStatsResults = statsData
  } else {
    fieldData = await getFieldUpdates()
    if (fieldData && !fieldData.eventName.toLowerCase().includes(event.eventName.toLowerCase().split(' ')[0])) {
      fieldData = null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/events" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
          &larr; Back to Schedule
        </Link>
        <h1 className="text-2xl font-bold text-white">{event.eventName}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
          <span>{event.course}</span>
          {event.location && <span>{event.location}</span>}
          <span>{event.startDate}</span>
          <EventPurseClient
            eventId={eventId}
            season={season}
            eventName={event.eventName}
            initialPurse={event.purse ?? null}
          />
        </div>

        {availableYears.length > 1 && (
          <div className="mt-4">
            <YearSelector
              eventId={eventId}
              availableYears={availableYears}
              currentYear={isHistoricalYear ? requestedYear : null}
              currentSeasonYear={season}
            />
          </div>
        )}
      </div>

      {isCompleted && rawResults.length > 0 ? (
        <RawEventResults results={rawResults} selectedYear={resultsYear} />
      ) : isCompleted ? (
        <CompletedEventResults
          results={eventStatsResults}
          event={event}
          selectedYear={isHistoricalYear ? requestedYear : undefined}
        />
      ) : fieldData ? (
        <UpcomingEventField fieldData={fieldData} />
      ) : (
        <UpcomingEventEmpty />
      )}
    </div>
  )
}
