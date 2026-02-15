import type { RawHistoricalEvent, RawHistoricalEventResult } from '../types/historical-events'
import type { FinishStatus, HistoricalEventEntry, PlayerEventFinish } from '@/types/historical-events'

const NON_FINISH_STATUSES = new Set(['CUT', 'MC', 'MDF', 'WD', 'DQ'])

interface ParsedFinish {
  position: number | null
  status: FinishStatus
  displayText: string
}

/**
 * Strips embedded DG IDs from player names.
 * The API sometimes includes them as "(12345)" in names.
 */
function stripDgId(name: string): string {
  return name.replace(/\s*\(\d+\)\s*$/, '').trim()
}

/**
 * Formats player name from "Last, First" to "First Last".
 */
function formatDisplayName(rawName: string): string {
  const cleaned = stripDgId(rawName)
  const parts = cleaned.split(', ')
  if (parts.length < 2) return cleaned
  return `${parts[1]} ${parts[0]}`
}

/**
 * Adds ordinal suffix to a position number.
 * 1 → "1st", 2 → "2nd", 3 → "3rd", 4 → "4th", etc.
 */
function toOrdinal(n: number): string {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  const mod10 = n % 10
  if (mod10 === 1) return `${n}st`
  if (mod10 === 2) return `${n}nd`
  if (mod10 === 3) return `${n}rd`
  return `${n}th`
}

/**
 * Parses fin_text from the DataGolf API into structured finish data.
 *
 * - "1" → { position: 1, status: "finished", displayText: "1st" }
 * - "T5" → { position: 5, status: "finished", displayText: "T5" }
 * - "CUT" / "MC" → { position: null, status: "cut", displayText: "CUT" }
 * - "MDF" → { position: null, status: "mdf", displayText: "MDF" }
 * - "WD" → { position: null, status: "wd", displayText: "WD" }
 * - "DQ" → { position: null, status: "dq", displayText: "DQ" }
 */
export function parseFinishText(finText: string): ParsedFinish {
  const trimmed = finText.trim().toUpperCase()

  if (NON_FINISH_STATUSES.has(trimmed)) {
    const statusMap: Record<string, FinishStatus> = {
      CUT: 'cut',
      MC: 'cut',
      MDF: 'mdf',
      WD: 'wd',
      DQ: 'dq'
    }
    const status = statusMap[trimmed] ?? 'cut'
    // MC is synonymous with CUT; MDF displays as itself
    const displayText = trimmed === 'MC' ? 'CUT' : trimmed
    return { position: null, status, displayText }
  }

  // Tied position: "T5", "T23", etc.
  if (trimmed.startsWith('T')) {
    const num = parseInt(trimmed.slice(1), 10)
    if (!isNaN(num)) {
      return { position: num, status: 'finished', displayText: `T${num}` }
    }
  }

  // Numeric position: "1", "23", etc.
  const num = parseInt(trimmed, 10)
  if (!isNaN(num)) {
    return { position: num, status: 'finished', displayText: toOrdinal(num) }
  }

  // Unknown format — treat as cut to be safe
  return { position: null, status: 'cut', displayText: trimmed }
}

export function normalizeHistoricalEvent(raw: RawHistoricalEvent): HistoricalEventEntry {
  return {
    calendarYear: raw.calendar_year,
    date: raw.date,
    eventId: raw.event_id,
    eventName: raw.event_name,
    tour: raw.tour
  }
}

export function normalizeEventFinish(raw: RawHistoricalEventResult): PlayerEventFinish {
  const parsed = parseFinishText(raw.fin_text)
  return {
    dgId: raw.dg_id,
    playerName: formatDisplayName(raw.player_name),
    finishPosition: parsed.position,
    status: parsed.status,
    finishText: parsed.displayText,
    earnings: raw.earnings ?? null
  }
}
