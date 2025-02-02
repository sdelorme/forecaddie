'use server'

import Navbar from './navbar'
import LeaderboardScroll from './leaderboard-scroll'

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white rounded-t-lg">
      {/* Tournament Info */}
      <div className="p-2 text-center text-xs">
        <span>Pebble Beach Pro-Am • Round 4</span> |{' '}
        <span>Thursday, February 1, 2024</span>
      </div>
      <LeaderboardScroll />
      {/* Navbar */}
      <Navbar />
    </header>
  )
}

export default Header
