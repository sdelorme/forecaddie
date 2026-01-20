import { formatPlayerListName, getFirstLetterOfLastName } from '@/lib/utils'
import { dataGolfClient } from '../client'
import { ENDPOINTS, CACHE_TAGS, REVALIDATE_INTERVALS } from '../config'
import { RawPlayerListResponseSchema } from '../schemas/players'
import type { RawPlayer } from '../types/players'
import type { Player } from '@/types/player'

function normalizePlayer(player: RawPlayer): Player {
  return {
    amateur: player.amateur,
    country: player.country,
    countryCode: player.country_code,
    dgId: player.dg_id,
    playerName: player.player_name,
    displayName: formatPlayerListName(player),
    firstLetter: getFirstLetterOfLastName(player.player_name)
  }
}

export async function getPlayerList(): Promise<Player[]> {
  try {
    const response = await dataGolfClient<unknown>(ENDPOINTS.PLAYERS, {
      revalidate: REVALIDATE_INTERVALS.PLAYERS,
      tags: [CACHE_TAGS.PLAYERS],
      params: {
        file_format: 'json'
      },
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
      }
    })

    const parsed = RawPlayerListResponseSchema.safeParse(response)
    if (!parsed.success) {
      console.error('Invalid player list response:', parsed.error.format())
      return []
    }

    return parsed.data.map(normalizePlayer)
  } catch (error) {
    console.error('Error fetching player list:', error)
    return []
  }
}
