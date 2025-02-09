'use client'

import Image from 'next/image'
import { Star, Flag } from 'lucide-react'
import { LeaderboardPlayer } from '@/types/leaderboard'
import { useState } from 'react'
import { getPlayerImageUrl } from '@/lib/utils/player-images'
import { getScoreStyle } from '@/lib/utils/live-stats-helpers'
import { formatPlayerNameMobile } from '@/lib/utils/player'

type PlayerCardProps = {
  player: LeaderboardPlayer
}

export function PlayerCard({ player }: PlayerCardProps) {
  const [isFavorite, setIsFavorite] = useState(player.isFavorite ?? false)
  const [isFlagged, setIsFlagged] = useState(player.isFlagged ?? false)
  const imageUrl = getPlayerImageUrl(player.player_name)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleToggleFlag = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFlagged(!isFlagged)
  }

  const mobileFormattedPlayerName = formatPlayerNameMobile(player)

  return (
    <div className="flex-none snap-center bg-white text-black p-1 sm:p-2 rounded-sm shadow-sm min-w-[56px] sm:min-w-[180px] border border-gray-100">
      {/* Mobile Layout */}
      <div className="block sm:hidden relative">
        <div className="w-16 h-16 rounded-full overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={player.player_name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        {/* Score Bubble */}
        <div
          className={`absolute -top-1 -right-1 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full ${getScoreStyle(
            player.score,
            'bg'
          )}`}
        >
          {player.score}
        </div>
        <div className="text-center mt-1">
          <p className="text-[10px] font-semibold text-gray-600">
            {player.position}. {mobileFormattedPlayerName}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-start gap-2">
        <span className="text-gray-600 font-semibold text-sm">
          {player.position}
        </span>
        <div className="w-10 h-10 rounded-full overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={player.player_name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-1">
            <span className="font-bold text-sm">{player.player_name}</span>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={handleToggleFavorite}
                className="hover:scale-110 transition-transform"
                aria-label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isFavorite
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  } stroke-[1.5]`}
                />
              </button>
              <button
                onClick={handleToggleFlag}
                className="hover:scale-110 transition-transform"
                aria-label={isFlagged ? 'Remove flag' : 'Add flag'}
              >
                <Flag
                  className={`w-3.5 h-3.5 ${
                    isFlagged ? 'text-red-400 fill-red-400' : 'text-gray-300'
                  } stroke-[1.5]`}
                />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`font-semibold text-base ${getScoreStyle(
                player.score,
                'text'
              )}`}
            >
              {player.score}
            </span>
            <span className="text-gray-400 text-[10px]">{player.status}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
