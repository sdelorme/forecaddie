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

  const skillRatingsValuePromise = dataGolfClient<unknown>(ENDPOINTS.SKILL_RATINGS, {
    revalidate: REVALIDATE_INTERVALS.RANKINGS,
    tags: [CACHE_TAGS.RANKINGS],
    params: {
      display: 'value',
      file_format: 'json'
    },
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  })

  const skillRatingsRankPromise = dataGolfClient<unknown>(ENDPOINTS.SKILL_RATINGS, {
    revalidate: REVALIDATE_INTERVALS.RANKINGS,
    tags: [CACHE_TAGS.RANKINGS],
    params: {
      display: 'rank',
      file_format: 'json'
    },
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800'
    }
  })

  const [playerList, rankingsResponse, skillRatingsValueResponse, skillRatingsRankResponse] = await Promise.all([
    playerListPromise,
    rankingsPromise.catch(() => null),
    skillRatingsValuePromise.catch(() => null),
    skillRatingsRankPromise.catch(() => null)
  ])

  const profile = playerList.find((player) => player.dgId === dgId) ?? null

  const rankingsParsed = rankingsResponse ? RawDgRankingsResponseSchema.safeParse(rankingsResponse) : null
  const skillValParsed = skillRatingsValueResponse
    ? RawSkillRatingsResponseSchema.safeParse(skillRatingsValueResponse)
    : null
  const skillRankParsed = skillRatingsRankResponse
    ? RawSkillRatingsResponseSchema.safeParse(skillRatingsRankResponse)
    : null

  if (rankingsParsed && !rankingsParsed.success) {
    console.error('Invalid DataGolf rankings response:', rankingsParsed.error.format())
  }
  if (skillValParsed && !skillValParsed.success) {
    console.error('Invalid skill ratings (value) response:', skillValParsed.error.format())
  }
  if (skillRankParsed && !skillRankParsed.success) {
    console.error('Invalid skill ratings (rank) response:', skillRankParsed.error.format())
  }

  const dgRanking = rankingsParsed?.success
    ? rankingsParsed.data.rankings.find((ranking) => ranking.dg_id === dgId)
    : undefined
  const skillRatingValue = skillValParsed?.success
    ? skillValParsed.data.players.find((rating) => rating.dg_id === dgId)
    : undefined
  const skillRatingRank = skillRankParsed?.success
    ? skillRankParsed.data.players.find((rating) => rating.dg_id === dgId)
    : undefined
  const totalSkillPlayers = skillRankParsed?.success ? skillRankParsed.data.players.length : undefined

  const tournamentHistory: RawEventResult[] = []

  return {
    profile,
    rankings: mapPlayerRankings({ dgRanking, skillRatingValue, skillRatingRank }),
    totalRankedPlayers: totalSkillPlayers,
    tournamentHistory: mapTournamentHistory(tournamentHistory, dgId)
  }
}
