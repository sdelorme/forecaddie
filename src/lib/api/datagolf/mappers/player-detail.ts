import type { RawDgRanking, RawEventResult, RawSkillRating } from '../types/player-detail'
import type { PlayerRanking, PlayerTournamentResult } from '@/types/player-detail'

const getNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value)
  }
  return null
}

const getString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim() !== '') return value
  return null
}

const getRecordValue = (record: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    if (record[key] != null) return record[key]
  }
  return null
}

function toOrdinal(n: number): string {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  const mod10 = n % 10
  if (mod10 === 1) return `${n}st`
  if (mod10 === 2) return `${n}nd`
  if (mod10 === 3) return `${n}rd`
  return `${n}th`
}

function formatRank(rank: number): string {
  return toOrdinal(Math.round(rank))
}

export function mapPlayerRankings({
  dgRanking,
  skillRatingValue,
  skillRatingRank
}: {
  dgRanking?: RawDgRanking
  skillRatingValue?: RawSkillRating
  skillRatingRank?: RawSkillRating
}): PlayerRanking[] {
  const rankings: PlayerRanking[] = []

  if (dgRanking) {
    const dgRank = getNumber((dgRanking as Record<string, unknown>).datagolf_rank)
    if (dgRank != null) rankings.push({ label: 'DataGolf Rank', value: Math.round(dgRank) })

    const owgr = getNumber((dgRanking as Record<string, unknown>).owgr_rank)
    if (owgr != null) rankings.push({ label: 'OWGR Rank', value: Math.round(owgr) })

    const dgSkillEstimate = getNumber((dgRanking as Record<string, unknown>).dg_skill_estimate)
    if (dgSkillEstimate != null) {
      rankings.push({ label: 'DG Skill Estimate', value: dgSkillEstimate.toFixed(2) })
    }
  }

  const skillMetrics: Array<{ label: string; key: string }> = [
    { label: 'SG Total', key: 'sg_total' },
    { label: 'SG Off-the-Tee', key: 'sg_ott' },
    { label: 'SG Approach', key: 'sg_app' },
    { label: 'SG Around Green', key: 'sg_arg' },
    { label: 'SG Putting', key: 'sg_putt' },
    { label: 'Driving Accuracy', key: 'driving_acc' },
    { label: 'Driving Distance', key: 'driving_dist' }
  ]

  const rankRecord = skillRatingRank ? (skillRatingRank as Record<string, unknown>) : null
  const valueRecord = skillRatingValue ? (skillRatingValue as Record<string, unknown>) : null

  skillMetrics.forEach(({ label, key }) => {
    const rank = rankRecord ? getNumber(rankRecord[key]) : null
    if (rank != null) {
      rankings.push({ label, value: formatRank(rank) })
    } else {
      const value = valueRecord ? getNumber(valueRecord[key]) : null
      if (value != null) rankings.push({ label, value: value.toFixed(3) })
    }
  })

  return rankings
}

export function mapTournamentHistory(results: RawEventResult[], dgId: number): PlayerTournamentResult[] {
  const mapped = results
    .filter((result) => result.dg_id === dgId)
    .map((result) => {
      const record = result as Record<string, unknown>
      const eventName =
        getString(getRecordValue(record, ['event_name', 'tournament', 'event'])) ||
        (record.event_id ? `Event ${record.event_id}` : 'Event')

      const year = getNumber(record.year)
      const finishPosition = getNumber(getRecordValue(record, ['finish_position', 'fin_pos', 'position', 'finish']))
      const earnings = getNumber(getRecordValue(record, ['earnings', 'earning', 'winnings']))

      return {
        eventName,
        year: year ?? undefined,
        finishPosition,
        earnings
      }
    })
    .filter((result) => result.eventName !== 'Event')

  return mapped.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
}
