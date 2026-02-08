'use client'

import { useMemo } from 'react'
import { usePlayerFlagsContext } from '@/components/providers'
import type { LeaderboardPlayer } from '@/types/leaderboard'

type SortedLeaderboard = {
  /** Favorited players, sorted by position */
  starred: LeaderboardPlayer[]
  /** Remaining players, sorted by position */
  rest: LeaderboardPlayer[]
}

/**
 * Partitions leaderboard players into starred (favorites) and non-starred groups.
 *
 * - Starred players appear first, maintaining their relative position sort.
 * - Non-starred players follow, also in position order.
 * - Flags do NOT affect sort order (per spec).
 */
export function useSortedLeaderboard(players: LeaderboardPlayer[]): SortedLeaderboard {
  const { flags } = usePlayerFlagsContext()

  return useMemo(() => {
    const starred: LeaderboardPlayer[] = []
    const rest: LeaderboardPlayer[] = []

    for (const player of players) {
      const flag = flags.get(player.dgId)
      if (flag?.isFavorite) {
        starred.push(player)
      } else {
        rest.push(player)
      }
    }

    return { starred, rest }
  }, [players, flags])
}
