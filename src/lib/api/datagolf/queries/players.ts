import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import type { RawPlayer } from '../types/players'
import type { Player } from '@/types/player'

function normalizePlayer(player: RawPlayer): Player {
  return {
    amateur: player.amateur,
    country: player.country,
    countryCode: player.country_code,
    dgId: player.dg_id,
    playerName: player.player_name
  }
}

export async function getPlayerList(): Promise<Player[]> {
  try {
    const response = await dataGolfClient<RawPlayer[]>(ENDPOINTS.PLAYERS, {
      revalidate: REVALIDATE_INTERVALS.PLAYERS,
      tags: [CACHE_TAGS.PLAYERS],
      params: {
        file_format: 'json'
      },
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
      }
    })

    if (!Array.isArray(response)) {
      console.error('Invalid player list response:', response)
      return []
    }

    return response.map(normalizePlayer)
  } catch (error) {
    console.error('Error fetching player list:', error)
    return []
  }
}
