import { getPlayerList } from './players'
import { dataGolfClient } from '../client'
import { CACHE_TAGS, ENDPOINTS, REVALIDATE_INTERVALS } from '../config'
import { RawDgRankingsResponseSchema, RawSkillRatingsResponseSchema } from '../schemas/player-detail'
import { mapPlayerRankings, mapTournamentHistory } from '../mappers/player-detail'
import type { PlayerDetail } from '@/types/player-detail'
import type { RawEventResult } from '../types/player-detail'

export async function getPlayerDetail(dgId: number): Promise<PlayerDetail> {
  const playerListPromise = getPlayerList()

  const rankingsPromise = dataGolfClient<unknown>(ENDPOINTS.DG_RANKINGS, {
    revalidate: REVALIDATE_INTERVALS.RANKINGS,
    tags: [CACHE_TAGS.RANKINGS],
    params: {
      file_format: 'json'
    },
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  })

  const skillRatingsPromise = dataGolfClient<unknown>(ENDPOINTS.SKILL_RATINGS, {
    revalidate: REVALIDATE_INTERVALS.RANKINGS,
    tags: [CACHE_TAGS.RANKINGS],
    params: {
      file_format: 'json'
    },
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  })

  const [playerList, rankingsResponse, skillRatingsResponse] = await Promise.all([
    playerListPromise,
    rankingsPromise.catch(() => null),
    skillRatingsPromise.catch(() => null)
  ])

  const profile = playerList.find((player) => player.dgId === dgId) ?? null

  const rankingsParsed = rankingsResponse ? RawDgRankingsResponseSchema.safeParse(rankingsResponse) : null
  const skillRatingsParsed = skillRatingsResponse ? RawSkillRatingsResponseSchema.safeParse(skillRatingsResponse) : null
  if (rankingsParsed && !rankingsParsed.success) {
    console.error('Invalid DataGolf rankings response:', rankingsParsed.error.format())
  }

  if (skillRatingsParsed && !skillRatingsParsed.success) {
    console.error('Invalid skill ratings response:', skillRatingsParsed.error.format())
  }

  const dgRanking = rankingsParsed?.success
    ? rankingsParsed.data.rankings.find((ranking) => ranking.dg_id === dgId)
    : undefined
  const skillRating = skillRatingsParsed?.success
    ? skillRatingsParsed.data.players.find((rating) => rating.dg_id === dgId)
    : undefined

  const tournamentHistory: RawEventResult[] = []

  return {
    profile,
    rankings: mapPlayerRankings({ dgRanking, skillRating }),
    tournamentHistory: mapTournamentHistory(tournamentHistory, dgId)
  }
}
