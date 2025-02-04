import { LeaderboardPlayer } from '@/types/leaderboard'

export const MOCK_PLAYERS: LeaderboardPlayer[] = Array.from({ length: 10 }).map((_, i) => ({
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