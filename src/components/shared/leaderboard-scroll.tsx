import type { LeaderboardEvent, LeaderboardPlayer } from '@/types/leaderboard'
import { PlayerCard } from './player-card'

type LeaderboardScrollProps = {
  leaderboardPlayers: LeaderboardPlayer[]
  eventInfo?: LeaderboardEvent
}

export function LeaderboardScroll({ leaderboardPlayers = [], eventInfo }: LeaderboardScrollProps) {
  if (!leaderboardPlayers || leaderboardPlayers.length === 0) {
    return (
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-1 sm:gap-1 p-1 sm:p-1 scrollbar-hide bg-primary border-b-[1px]">
        <div className="flex-none snap-center bg-white/10 text-white p-1 sm:p-2 rounded-sm shadow-sm min-w-[56px] sm:min-w-[180px] border border-white/10">
          <div className="flex flex-col items-center">
            <div className="text-sm">No Active Tournament</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col border-b-[1px] bg-primary">
      {eventInfo && (
        <div className="px-2 py-1 text-[10px]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-400">
            <span className="text-white whitespace-nowrap">{eventInfo.eventName}</span>
            <span className="whitespace-nowrap">{eventInfo.course}</span>
          </div>
        </div>
      )}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-1 sm:gap-1 p-1 sm:p-1 scrollbar-hide">
        {leaderboardPlayers.map((player) => {
          return <PlayerCard key={player.dgId} player={player} />
        })}
      </div>
    </div>
  )
}
