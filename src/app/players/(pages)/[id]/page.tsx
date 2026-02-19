import Image from 'next/image'
import { getPlayerDetail } from '@/lib/api/datagolf'
import { getHistoricalEventResults } from '@/lib/api/datagolf/queries/historical-events'
import { getHistoricalEventList } from '@/lib/api/datagolf/queries/historical-events'
import PlayerRankingsTable from '../../(components)/player-rankings-table'
import { getPlayerImageUrl, formatPlayerName } from '@/lib/utils'
import { cn } from '@/lib/utils'

type PlayerPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    event?: string
  }>
}

export default async function PlayerPage({ params, searchParams }: PlayerPageProps) {
  const [resolvedParams, resolvedSearch] = await Promise.all([params, searchParams])
  const playerId = Number(resolvedParams.id)
  const eventId = resolvedSearch.event

  const detail = await getPlayerDetail(playerId)
  const profile = detail.profile
  const playerName = profile?.playerName ? formatPlayerName(profile.playerName) : `Player ${resolvedParams.id}`
  const playerImage = getPlayerImageUrl(playerName)

  let eventContext: { eventName: string; finishText: string; year: number; earnings: number | null } | null = null

  if (eventId && /^\d+$/.test(eventId)) {
    const numericEventId = Number(eventId)
    const currentYear = new Date().getFullYear()

    const [eventList, results] = await Promise.all([
      getHistoricalEventList(),
      getHistoricalEventResults(numericEventId, currentYear)
    ])

    const eventEntry = eventList.find((e) => e.eventId === numericEventId)
    const playerFinish = results.find((r) => r.dgId === playerId)

    if (eventEntry && playerFinish) {
      eventContext = {
        eventName: eventEntry.eventName,
        finishText: playerFinish.finishText,
        year: eventEntry.calendarYear,
        earnings: playerFinish.earnings
      }
    }
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="flex flex-col gap-6 md:flex-row md:items-center bg-gray-800 rounded-lg p-6">
          <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
            <Image src={playerImage} alt={playerName} fill className="object-cover" sizes="112px" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">DataGolf ID: {Number.isNaN(playerId) ? '—' : playerId}</p>
            <h1 className="text-3xl font-bold text-white">{playerName}</h1>
            {profile ? (
              <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                <span>{profile.country}</span>
                <span>•</span>
                <span>{profile.amateur ? 'Amateur' : 'Professional'}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Player profile details are unavailable.</p>
            )}
          </div>
        </section>

        {eventContext && (
          <section className="bg-gray-800/60 border border-gray-700 rounded-lg px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Event Context</p>
            <p className="text-white">
              <span className="font-medium">{eventContext.eventName}</span>
              <span className="text-gray-400"> ({eventContext.year})</span>
              <span className="mx-2 text-gray-600">•</span>
              <span
                className={cn(
                  'font-semibold',
                  eventContext.finishText === 'CUT' || eventContext.finishText === 'WD'
                    ? 'text-red-400'
                    : 'text-primary'
                )}
              >
                {eventContext.finishText}
              </span>
              {eventContext.earnings != null && eventContext.earnings > 0 && (
                <>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-gray-300">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(eventContext.earnings)}
                  </span>
                </>
              )}
            </p>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6">
          <PlayerRankingsTable playerName={playerName} rankings={detail.rankings} />
        </div>
      </div>
    </main>
  )
}
