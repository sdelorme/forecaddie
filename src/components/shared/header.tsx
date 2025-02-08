import { LeaderboardPlayer } from '@/types/leaderboard'
import { LeaderboardScroll } from './leaderboard-scroll'
import Navbar from './navbar'

type HeaderProps = {
  leaderboardData: LeaderboardPlayer[]
  eventData?: {
    name: string
    course: string
    lastUpdated: string
  }
}

export default function Header({ leaderboardData, eventData }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 transition-transform duration-300">
      <div className="header-scrolled:-translate-y-[72px]">
        <LeaderboardScroll players={leaderboardData} event={eventData} />
        <Navbar />
      </div>
    </header>
  )
}
