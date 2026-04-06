import { TournamentStatusBadge, NextUpBanner } from '@/components/shared'
import type { TourEvent } from '@/types/schedule'

type OddsHeaderProps = {
  eventName: string
  isComplete: boolean
  nextEvent: TourEvent | null
}

export function OddsHeader({ eventName, isComplete, nextEvent }: OddsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
        <TournamentStatusBadge status={isComplete ? 'final' : 'live'} size="md" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white min-w-0">{eventName} Tournament Odds</h1>
      </div>
      {isComplete && nextEvent && (
        <div className="border-t border-white/10 pt-4 mt-4">
          <NextUpBanner eventName={nextEvent.eventName} variant="odds" />
        </div>
      )}
    </div>
  )
}
