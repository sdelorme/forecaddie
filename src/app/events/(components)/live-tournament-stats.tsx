import type { LeaderboardEvent, LeaderboardPlayer } from '@/types/leaderboard'
import { getScoreStyle } from '@/lib/utils/live-stats-helpers'
import { formatLeaderboardPlayerName } from '@/lib/utils/player'

interface LiveLeaderboardProps {
  players: LeaderboardPlayer[]
  eventInfo: LeaderboardEvent
}

export function LiveLeaderboard({ players, eventInfo }: LiveLeaderboardProps) {
  const { eventName, course, lastUpdated } = eventInfo
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Info Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{eventName}</h1>
        <p className="text-gray-400">
          {course} • Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      {/* Players List */}
      <div className="grid gap-4">
        {players.map(
          ({ dgId, currentPosition, playerName, currentScore, thru }) => (
            <div
              key={dgId}
              className="bg-gray-900 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 w-8">{currentPosition}</span>
                  <span className="text-white font-semibold">
                    {formatLeaderboardPlayerName({ playerName })}
                  </span>
                </div>
                <div className="text-gray-400 text-sm ml-12">{thru}</div>
              </div>
              <div className="text-xl font-mono">
                <span className={getScoreStyle(currentScore, 'text')}>
                  {currentScore}
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
