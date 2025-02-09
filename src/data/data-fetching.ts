import { LeaderboardPlayer } from '@/types/leaderboard'

interface LeaderboardResponse {
  players: LeaderboardPlayer[]
  event: {
    name: string
    course: string
    lastUpdated: string
  }
}

export async function getLiveLeaderboard(): Promise<LeaderboardResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/live/live-stats`,
      {
        next: {
          revalidate: 300, // Revalidate every 5 minutes
        },
      }
    )

    if (!response.ok) {
      console.error(
        'API response not ok:',
        response.status,
        response.statusText
      )
      throw new Error('Failed to fetch live stats')
    }

    const data = await response.json()

    // Transform the live stats into our expected format
    const transformedData = {
      players:
        data.live_stats?.map((player: any) => ({
          dg_id: player.dg_id,
          position: player.position,
          player_name: player.player_name,
          score: player.total,
          status: player.thru === 18 ? 'F' : `Thru ${player.thru}`,
          imageUrl: '/homa-no-bg.png',
          amateur: 0,
          country: 'USA',
          country_code: 'US',
          isFavorite: false,
          isFlagged: false,
        })) || [],
      event: {
        name: data.event_name || 'No Active Tournament',
        course: data.course_name || 'N/A',
        lastUpdated: data.last_updated || new Date().toISOString(),
      },
    }

    return transformedData
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return {
      players: [],
      event: {
        name: 'No Active Tournament',
        course: 'N/A',
        lastUpdated: new Date().toISOString(),
      },
    }
  }
}
