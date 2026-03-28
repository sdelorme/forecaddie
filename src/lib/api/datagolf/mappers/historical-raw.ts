import { parseFinishText } from './historical-events'
import type { RawHistoricalRawEvent, RawHistoricalRawScore, RawRoundData } from '../types/historical-raw'
import type { HistoricalRawEvent, HistoricalRawPlayerResult, RoundSummary } from '@/types/historical-raw'
import type { PlayerEventFinish } from '@/types/historical-events'

function stripDgId(name: string): string {
  return name.replace(/\s*\(\d+\)\s*$/, '').trim()
}

function formatDisplayName(rawName: string): string {
  const cleaned = stripDgId(rawName)
  const parts = cleaned.split(', ')
  if (parts.length < 2) return cleaned
  return `${parts[1]} ${parts[0]}`
}

function mapRound(round: RawRoundData | null | undefined): RoundSummary | null {
  if (!round) return null
  return {
    score: round.score,
    courseName: round.course_name,
    coursePar: round.course_par,
    sgTotal: round.sg_total ?? null
  }
}

export function normalizeRawEvent(raw: RawHistoricalRawEvent): HistoricalRawEvent {
  return {
    calendarYear: raw.calendar_year,
    date: raw.date,
    eventId: raw.event_id,
    eventName: raw.event_name,
    hasSgCategories: raw.sg_categories === 'yes',
    hasTraditionalStats: raw.traditional_stats === 'yes'
  }
}

export function normalizeRawPlayerResult(raw: RawHistoricalRawScore): HistoricalRawPlayerResult {
  const parsed = parseFinishText(raw.fin_text)

  const rounds = [mapRound(raw.round_1), mapRound(raw.round_2), mapRound(raw.round_3), mapRound(raw.round_4)]

  const playedRounds = rounds.filter((r): r is RoundSummary => r !== null)
  const totalScore = playedRounds.length > 0 ? playedRounds.reduce((sum, r) => sum + r.score, 0) : null
  const totalPar = playedRounds.length > 0 ? playedRounds.reduce((sum, r) => sum + r.coursePar, 0) : null

  return {
    dgId: raw.dg_id,
    playerName: formatDisplayName(raw.player_name),
    finishPosition: parsed.position,
    finishText: parsed.displayText,
    status: parsed.status,
    totalScore,
    totalPar,
    rounds
  }
}

export function rawResultToEventFinish(result: HistoricalRawPlayerResult): PlayerEventFinish {
  return {
    dgId: result.dgId,
    playerName: result.playerName,
    finishPosition: result.finishPosition,
    status: result.status,
    finishText: result.finishText,
    earnings: null
  }
}
