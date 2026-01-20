import { TournamentStatusBadge, NextUpBanner } from '@/components/shared'
import type { LeaderboardEvent } from '@/types/leaderboard'
import type { TourEvent } from '@/types/schedule'

type LeaderboardHeaderProps = {
  eventInfo: LeaderboardEvent
  isComplete: boolean
  nextEvent: TourEvent | null
}

export function LeaderboardHeader({ eventInfo, isComplete, nextEvent }: LeaderboardHeaderProps) {
  return (
    <div className="container mx-auto px-4 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <TournamentStatusBadge status={isComplete ? 'final' : 'live'} size="md" />
        <h1 className="text-3xl font-bold text-white">{eventInfo.eventName}</h1>
      </div>
      <p className="text-gray-400 mb-4">{eventInfo.course}</p>
      {isComplete && nextEvent && (
        <div className="border-t border-white/10 pt-4">
          <NextUpBanner eventName={nextEvent.eventName} startDate={nextEvent.startDate} />
        </div>
      )}
    </div>
  )
}
