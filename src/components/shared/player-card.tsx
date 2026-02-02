'use client'

import Image from 'next/image'
import { Star, Flag, type LucideIcon } from 'lucide-react'
import type { LeaderboardPlayer } from '@/types/leaderboard'
import { getPlayerImageUrl, getScoreStyle, formatLeaderboardPlayerName } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { usePlayerFlagsContext } from '@/components/providers'

type PlayerCardProps = {
  player: LeaderboardPlayer
}

const iconColorClasses = {
  yellow: 'text-yellow-400 fill-yellow-400',
  red: 'text-red-400 fill-red-400'
} as const

type IconColor = keyof typeof iconColorClasses

type IconButtonProps = {
  icon: LucideIcon
  isActive: boolean
  onClick: (e: React.MouseEvent) => void
  activeColor: IconColor
  ariaLabel: string
}

const IconButton = ({ icon: Icon, isActive, onClick, activeColor, ariaLabel }: IconButtonProps) => (
  <button onClick={onClick} className="hover:scale-110 transition-transform" aria-label={ariaLabel}>
    <Icon className={`w-3.5 h-3.5 ${isActive ? iconColorClasses[activeColor] : 'text-gray-300'} stroke-[1.5]`} />
  </button>
)

const PlayerAvatar = ({ imageUrl, playerName, size }: { imageUrl: string; playerName: string; size: number }) => (
  <div className={`flex-shrink-0 rounded-full overflow-hidden`}>
    <Image
      src={imageUrl || '/placeholder.svg'}
      alt={playerName}
      width={size}
      height={size}
      className="object-cover"
      sizes={`${size * 4}px`}
    />
  </div>
)

export function PlayerCard({ player: { dgId, playerName, currentScore, currentPosition, thru } }: PlayerCardProps) {
  const { getPlayerFlag, toggleFavorite, toggleFlag } = usePlayerFlagsContext()
  const router = useRouter()
  const { isFavorite, isFlagged } = getPlayerFlag(dgId)
  const imageUrl = getPlayerImageUrl(playerName) || '/placeholder.svg'

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(dgId)
  }

  const handleToggleFlag = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFlag(dgId)
  }

  const handleNavigate = () => {
    router.push(`/players/${dgId}`)
  }

  const formattedPlayerName = formatLeaderboardPlayerName({ playerName })
  const desktopScoreStyle = getScoreStyle(currentScore)
  const mobileScoreStyle = getScoreStyle(currentScore, 'bg')

  return (
    <article
      onClick={handleNavigate}
      className="flex-none snap-center sm:w-48 sm:bg-white sm:text-black p-1 sm:p-2 sm:rounded-sm sm:shadow-sm sm:border sm:border-gray-100 cursor-pointer"
    >
      {/* Mobile Layout */}
      <div className="sm:hidden relative flex flex-col items-center w-20">
        <div className="relative">
          <PlayerAvatar imageUrl={imageUrl} playerName={playerName} size={48} />
          <div
            className={`absolute -top-1 -right-1 text-white text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full shadow-md ${mobileScoreStyle}`}
          >
            {currentScore}
          </div>
        </div>

        <div className="text-center mt-1 w-20">
          <p className="text-[9px] font-semibold text-white truncate">
            {currentPosition}. {formattedPlayerName}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-start gap-2">
        <span className="text-gray-600 font-semibold text-sm">{currentPosition}</span>
        <PlayerAvatar imageUrl={imageUrl} playerName={playerName} size={48} />

        <div className="flex flex-col w-full overflow-hidden">
          <span className="font-bold text-sm truncate">{formattedPlayerName}</span>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1">
              <span className={`font-semibold text-base ${desktopScoreStyle}`}>{currentScore}</span>
              <span className="text-gray-400 text-[10px]">{thru}</span>
            </div>

            <div className="flex gap-2">
              <IconButton
                icon={Star}
                isActive={isFavorite}
                onClick={handleToggleFavorite}
                activeColor="yellow"
                ariaLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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
