'use client'

import { useLiveStats } from '../providers/live-stats-provider'
import { LeaderboardScroll } from './leaderboard-scroll'
import Navbar from './navbar'

export default function Header() {
  const { players: leaderboardPlayers, eventInfo, loading } = useLiveStats()

  return (
    <header className="fixed top-0 w-full z-50 transition-transform duration-300">
      <div className="header-scrolled:-translate-y-[72px]">
        {loading ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-1 sm:gap-1 p-1 sm:p-1 scrollbar-hide bg-primary border-b-[1px]">
            <div className="flex-none snap-center bg-white/10 text-white p-1 sm:p-2 rounded-sm shadow-sm min-w-[56px] sm:min-w-[180px] border border-white/10">
              <div className="flex flex-col items-center">
                <div className="text-sm">Loading Tournament Data...</div>
              </div>
            </div>
          </div>
        ) : (
          <LeaderboardScroll leaderboardPlayers={leaderboardPlayers} eventInfo={eventInfo} />
        )}
        <Navbar />
      </div>
    </header>
  )
}
