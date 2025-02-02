'use server'

import { LeaderboardScroll } from './leaderboard-scroll'
import Navbar from './navbar'
import { LeaderboardPlayer } from '@/types/leaderboard'

type HeaderProps = {
  leaderboardData: LeaderboardPlayer[]
}

const Header = ({ leaderboardData }: HeaderProps) => {
  return (
    <header className="bg-primary text-white rounded-t-lg">
      {/* Tournament Info */}
      <div className="p-2 text-center text-xs">
        <span>Pebble Beach Pro-Am • Round 4</span> |{' '}
        <span>Thursday, February 1, 2024</span>
      </div>
      <LeaderboardScroll players={leaderboardData} />
      {/* Navbar */}
      <Navbar />
    </header>
  )
}

export default Header
