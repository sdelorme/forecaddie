import { Player } from './player'

export type LeaderboardPlayer = Player & {
  position: string
  score: string
  imageUrl: string
  status: string
  isFavorite?: boolean
  isFlagged?: boolean
}
