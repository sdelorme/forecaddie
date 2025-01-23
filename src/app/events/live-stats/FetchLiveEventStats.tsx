import { LiveEventStats } from '../types'

const LiveTournamentStats: React.FC<LiveEventStats> = ({
  course_name,
  event_name,
  last_updated,
  live_stats,
}) => {
  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 md:px-8">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">{event_name}</h1>
        <h2 className="text-lg text-gray-600">{course_name}</h2>
        <p className="text-sm text-gray-500">Last updated: {last_updated}</p>
      </header>

      {/* Leaderboard */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Position
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Player
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Total Score
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Round Score
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                SG Total
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Thru
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {live_stats.map((player) => (
              <tr key={player.dg_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">
                  {player.position}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {player.player_name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {player.total}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {player.round}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {player.sg_total !== null
                    ? player.sg_total.toFixed(3)
                    : 'N/A'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {player.thru}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LiveTournamentStats
