'use client'

import { useLiveStats } from '../providers/live-stats-provider'
import { LeaderboardScroll } from './leaderboard-scroll'
import Navbar from './navbar'

export default function Header() {
  const { players: leaderboardPlayers, eventInfo } = useLiveStats()

  return (
    <header className="fixed top-0 w-full z-50 transition-transform duration-300">
      <div className="header-scrolled:-translate-y-[72px]">
        <LeaderboardScroll leaderboardPlayers={leaderboardPlayers} eventInfo={eventInfo} />
        <Navbar />
      </div>
    </header>
  )
}
