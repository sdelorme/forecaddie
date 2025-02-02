import { Player } from './player'

export type LeaderboardPlayer = Player & {
  position: number
  score: number
  imageUrl: string
  status: string
  isFavorite?: boolean
  isFlagged?: boolean
} 