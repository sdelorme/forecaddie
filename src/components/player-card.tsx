import Image from 'next/image'
import { Star, Flag } from 'lucide-react'
import { LeaderboardPlayer } from '@/types/leaderboard'

type PlayerCardProps = {
  player: LeaderboardPlayer
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="flex-none snap-center bg-white text-black sm:p-3 rounded-sm shadow-sm min-w-[64px] sm:min-w-[250px] border border-gray-100">
      {/* Mobile Layout */}
      <div className="block sm:hidden relative">
        <div className="w-16 h-16 rounded-full overflow-hidden relative">
          <Image
            src={player.imageUrl}
            alt={player.player_name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
          {player.score}
        </div>
        <div className="text-center mt-1">
          <p className="text-[10px] font-semibold text-gray-600">
            {player.position}. {player.player_name}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-start">
        <span className="text-gray-600 font-semibold text-base">
          T{player.position}
        </span>
        <div className="w-16 h-16 rounded-full overflow-hidden relative mr-6">
          <Image
            src={player.imageUrl}
            alt={player.player_name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <span className="font-bold text-xl pr-3">{player.player_name}</span>
            <div className="flex flex-col space-y-1">
              <Star className={`w-5 h-5 ${player.isFavorite ? 'text-yellow-400' : 'text-gray-300'} stroke-[1.5]`} />
              <Flag className={`w-5 h-5 ${player.isFlagged ? 'text-red-400' : 'text-gray-300'} stroke-[1.5]`} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-primary font-semibold text-2xl">{player.score}</span>
            <span className="text-gray-400 text-xs">{player.status}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 