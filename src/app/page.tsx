import Header from '@/components/header'
import ImageGrid from '../components/image-grid'
import HeroSection from '../components/landing-hero'
import Steps from '../components/landing-step-by-step'
import Footer from '@/components/footer'
import { LeaderboardPlayer } from '@/types/leaderboard'

// Mock data - will be replaced with API data later
const MOCK_PLAYERS: LeaderboardPlayer[] = Array.from({ length: 10 }).map((_, i) => ({
  dg_id: i + 1,
  position: i + 1,
  player_name: 'HOMA',
  score: -20 + i,
  imageUrl: '/homa-no-bg.png',
  status: 'Thru F',
  isFavorite: false,
  isFlagged: false,
  amateur: 0,
  country: 'USA',
  country_code: 'US'
}))

export default async function Home() {
  // This will eventually be an API call
  const leaderboardData = MOCK_PLAYERS

  return (
    <>
      <Header leaderboardData={leaderboardData} />
      <HeroSection />
      <ImageGrid />
      <Steps />
      <Footer />
    </>
  )
}