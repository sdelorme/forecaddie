import { LeaderboardPlayer } from '@/types/leaderboard'
import { PlayerCard } from './player-card'

type LeaderboardScrollProps = {
  players: LeaderboardPlayer[]
  event?: {
    name: string
    course: string
    lastUpdated: string
  }
}

export function LeaderboardScroll({ players = [], event }: LeaderboardScrollProps) {
  if (!players || players.length === 0) {
    return (
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-1 sm:gap-1 p-1 sm:p-1 scrollbar-hide bg-primary">
        <div className="flex-none snap-center bg-white/10 text-white p-1 sm:p-2 rounded-sm shadow-sm min-w-[56px] sm:min-w-[180px] border border-white/10">
          <div className="flex flex-col items-center">
            <div className="text-sm">No Active Tournament</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-primary">
      {event && (
        <div className="px-2 py-1 text-[10px]">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-white">{event.name}</span>
            <span>•</span>
            <span>{event.course}</span>
            <span>•</span>
            <span>Updated: {new Date(event.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-1 sm:gap-1 p-1 sm:p-1 scrollbar-hide">
        {players.map((player) => (
          <PlayerCard key={player.dg_id} player={player} />
        ))}
      </div>
    </div>
  )
} 