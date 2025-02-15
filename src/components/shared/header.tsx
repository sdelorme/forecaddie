import { LeaderboardEvent, LeaderboardPlayer } from '@/types/leaderboard'
import { LeaderboardScroll } from './leaderboard-scroll'
import Navbar from './navbar'

type HeaderProps = {
  leaderboardPlayers: LeaderboardPlayer[]
  eventInfo?: LeaderboardEvent
}

export default function Header({ leaderboardPlayers, eventInfo }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 transition-transform duration-300">
      <div className="header-scrolled:-translate-y-[72px]">
        <LeaderboardScroll
          leaderboardPlayers={leaderboardPlayers}
          eventInfo={eventInfo}
        />
        <Navbar />
      </div>
    </header>
  )
}
