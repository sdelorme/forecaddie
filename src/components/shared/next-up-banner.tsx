import { formatTournamentDate } from '@/lib/utils/tournament-time'

type NextUpBannerProps = {
  eventName: string
  startDate?: string
  variant?: 'leaderboard' | 'odds'
}

export function NextUpBanner({ eventName, startDate, variant = 'leaderboard' }: NextUpBannerProps) {
  if (variant === 'odds') {
    return (
      <p className="text-sm text-gray-400">
        Next Tournament: <span className="text-white">{eventName}</span>
      </p>
    )
  }

  const formattedDate = startDate ? formatTournamentDate(startDate) : ''

  return (
    <p className="text-sm text-gray-400">
      Next Up: <span className="text-white">{eventName}</span>
      {formattedDate && ` — ${formattedDate}`}
    </p>
  )
}
