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

export function mapPlayerRankings({
  dgRanking,
  skillRating
}: {
  dgRanking?: RawDgRanking
  skillRating?: RawSkillRating
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

  if (skillRating) {
    const skillRecord = skillRating as Record<string, unknown>
    const skillMetrics: Array<{ label: string; key: string }> = [
      { label: 'SG Total', key: 'sg_total' },
      { label: 'SG Off-the-Tee', key: 'sg_ott' },
      { label: 'SG Approach', key: 'sg_app' },
      { label: 'SG Around Green', key: 'sg_arg' },
      { label: 'SG Putting', key: 'sg_putt' }
    ]

    skillMetrics.forEach(({ label, key }) => {
      const value = getNumber(skillRecord[key])
      if (value != null) rankings.push({ label, value: value.toFixed(3) })
    })
  }

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
