'use client'

import LeaderboardScrollWrapper from '../providers/leaderboard-scroll-wrapper'
import Navbar from './navbar'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50">
      <div className="header-scrolled:-translate-y-[72px]">
        <LeaderboardScrollWrapper />
        <Navbar />
      </div>
    </header>
  )
}
