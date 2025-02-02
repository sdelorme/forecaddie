import { LeaderboardPlayer } from '@/types/leaderboard'
import { PlayerCard } from './player-card'


type LeaderboardScrollProps = {
  players: LeaderboardPlayer[]
}

export function LeaderboardScroll({ players }: LeaderboardScrollProps) {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-1 sm:gap-1 p-1 sm:p-1 scrollbar-hide bg-primary">
      {players.map((player) => (
        <PlayerCard key={player.dg_id} player={player} />
      ))}
    </div>
  )
} 