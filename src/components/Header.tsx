import { LeaderboardPlayer } from '@/types/leaderboard'
import { LeaderboardScroll } from './leaderboard-scroll'
import Navbar from './navbar'

export default function Header({ leaderboardData }: { leaderboardData: LeaderboardPlayer[] }) {
  return (
    <header className="fixed top-0 w-full z-50 transition-transform duration-300">
      <div className="header-scrolled:-translate-y-[72px]">
        <LeaderboardScroll players={leaderboardData} />
        <Navbar />
      </div>
    </header>
  )
}
