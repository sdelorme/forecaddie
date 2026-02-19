import type { RawFieldPlayer, RawFieldUpdatesResponse } from '../types/field-updates'
import type { FieldPlayer, FieldUpdate, Wave } from '@/types/field-updates'

function stripDgId(name: string): string {
  return name.replace(/\s*\(\d+\)\s*$/, '').trim()
}

function formatDisplayName(rawName: string): string {
  const cleaned = stripDgId(rawName)
  const parts = cleaned.split(', ')
  if (parts.length < 2) return cleaned
  return `${parts[1]} ${parts[0]}`
}

function parseWave(earlyLate: number | null | undefined): Wave {
  if (earlyLate === 1) return 'early'
  if (earlyLate === 2) return 'late'
  return null
}

export function normalizeFieldPlayer(raw: RawFieldPlayer): FieldPlayer {
  return {
    dgId: raw.dg_id,
    playerName: formatDisplayName(raw.player_name),
    country: raw.country,
    teeTime: raw.r1_teetime ?? null,
    startHole: raw.start_hole ?? null,
    wave: parseWave(raw.early_late),
    isAmateur: raw.am === 1
  }
}

export function normalizeFieldUpdates(raw: RawFieldUpdatesResponse): FieldUpdate {
  return {
    courseName: raw.course_name,
    currentRound: raw.current_round,
    eventName: raw.event_name,
    players: raw.field.map(normalizeFieldPlayer)
  }
}
