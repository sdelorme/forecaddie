'use client'

import Image from 'next/image'
import { Star, Flag, type LucideIcon } from 'lucide-react'
import type { LeaderboardPlayer } from '@/types/leaderboard'
import { useState } from 'react'
import { getPlayerImageUrl } from '@/lib/utils/player-images'
import { getScoreStyle } from '@/lib/utils/live-stats-helpers'
import { formatLeaderboardPlayerName } from '@/lib/utils/player'

type PlayerCardProps = {
  player: LeaderboardPlayer
}

type IconButtonProps = {
  icon: LucideIcon
  isActive: boolean
  onClick: (e: React.MouseEvent) => void
  activeColor: string
  ariaLabel: string
}

const IconButton = ({
  icon: Icon,
  isActive,
  onClick,
  activeColor,
  ariaLabel,
}: IconButtonProps) => (
  <button
    onClick={onClick}
    className="hover:scale-110 transition-transform"
    aria-label={ariaLabel}
  >
    <Icon
      className={`w-3.5 h-3.5 ${
        isActive
          ? `text-${activeColor}-400 fill-${activeColor}-400`
          : 'text-gray-300'
      } stroke-[1.5]`}
    />
  </button>
)

const PlayerImage = ({
  imageUrl,
  playerName,
  size,
}: {
  imageUrl: string
  playerName: string
  size: number
}) => (
  <div
    className={`flex-shrink-0 w-${size} h-${size} rounded-full overflow-hidden relative`}
  >
    <Image
      src={imageUrl || '/placeholder.svg'}
      alt={playerName}
      fill
      className="object-cover"
      sizes={`${size * 4}px`}
    />
  </div>
)

export function PlayerCard({ player }: PlayerCardProps) {
  const [isFavorite, setIsFavorite] = useState(player.isFavorite ?? false)
  const [isFlagged, setIsFlagged] = useState(player.isFlagged ?? false)
  const imageUrl = getPlayerImageUrl(player.player_name) || '/placeholder.svg'

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleToggleFlag = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFlagged(!isFlagged)
  }

  const formattedPlayerName = formatLeaderboardPlayerName(player)
  const scoreStyle = getScoreStyle(player.score, 'text')

  return (
    <article className="flex-none snap-center sm:w-48 sm:bg-white sm:text-black p-1 sm:p-2 sm:rounded-sm sm:shadow-sm sm:border sm:border-gray-100">
      {/* Mobile Layout */}
      <div className="sm:hidden relative flex flex-col items-center w-20">
        <div className="relative">
          <PlayerImage
            imageUrl={imageUrl}
            playerName={player.player_name}
            size={16}
          />
          <div
            className={`absolute -top-1 -right-1 text-white text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full shadow-md ${getScoreStyle(
              player.score,
              'bg'
            )}`}
          >
            {player.score}
          </div>
        </div>

        <div className="text-center mt-1 w-20">
          <p className="text-[9px] font-semibold text-white truncate">
            {player.position}. {formattedPlayerName}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-start gap-2">
        <span className="text-gray-600 font-semibold text-sm">
          {player.position}
        </span>
        <PlayerImage
          imageUrl={imageUrl}
          playerName={player.player_name}
          size={10}
        />

        <div className="flex flex-col w-full overflow-hidden">
          <span className="font-bold text-sm truncate">
            {formattedPlayerName}
          </span>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className={`font-semibold text-base ${scoreStyle}`}>
                {player.score}
              </span>
              <span className="text-gray-400 text-[10px]">{player.status}</span>
            </div>

            <div className="flex gap-2">
              <IconButton
                icon={Star}
                isActive={isFavorite}
                onClick={handleToggleFavorite}
                activeColor="yellow"
                ariaLabel={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
              />
              <IconButton
                icon={Flag}
                isActive={isFlagged}
                onClick={handleToggleFlag}
                activeColor="red"
                ariaLabel={isFlagged ? 'Remove flag' : 'Add flag'}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
