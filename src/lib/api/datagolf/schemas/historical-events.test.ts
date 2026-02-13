import { describe, it, expect } from 'vitest'
import {
  RawHistoricalEventSchema,
  RawHistoricalEventListSchema,
  RawHistoricalEventResultSchema,
  RawHistoricalEventResultsResponseSchema
} from './historical-events'
import { parseFinishText, normalizeEventFinish, normalizeHistoricalEvent } from '../mappers/historical-events'

// ---------- Schema tests ----------

describe('RawHistoricalEventSchema', () => {
  const validEvent = {
    calendar_year: 2026,
    date: '2026-01-25',
    event_id: 2,
    event_name: 'The American Express',
    tour: 'pga'
  }

  it('parses valid event data', () => {
    const result = RawHistoricalEventSchema.safeParse(validEvent)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.event_name).toBe('The American Express')
      expect(result.data.event_id).toBe(2)
    }
  })

  it('rejects missing required fields', () => {
    const { event_id, ...missingId } = validEvent
    const result = RawHistoricalEventSchema.safeParse(missingId)
    expect(result.success).toBe(false)
  })

  it('rejects wrong types', () => {
    const result = RawHistoricalEventSchema.safeParse({
      ...validEvent,
      calendar_year: '2026' // should be number
    })
    expect(result.success).toBe(false)
  })
})

describe('RawHistoricalEventListSchema', () => {
  it('parses valid array of events', () => {
    const events = [
      {
        calendar_year: 2025,
        date: '2025-04-10',
        event_id: 14,
        event_name: 'The Masters Tournament',
        tour: 'pga'
      },
      {
        calendar_year: 2025,
        date: '2025-01-25',
        event_id: 2,
        event_name: 'The American Express',
        tour: 'pga'
      }
    ]
    const result = RawHistoricalEventListSchema.safeParse(events)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveLength(2)
    }
  })

  it('accepts empty array', () => {
    const result = RawHistoricalEventListSchema.safeParse([])
    expect(result.success).toBe(true)
  })
})

describe('RawHistoricalEventResultSchema', () => {
  it('parses result with all fields', () => {
    const result = RawHistoricalEventResultSchema.safeParse({
      dg_id: 18417,
      player_name: 'Scheffler, Scottie',
      fin_text: '1',
      earnings: 3600000,
      fec_points: 600,
      dg_points: 100
    })
    expect(result.success).toBe(true)
  })

  it('parses result with optional fields missing', () => {
    const result = RawHistoricalEventResultSchema.safeParse({
      dg_id: 18417,
      player_name: 'Scheffler, Scottie',
      fin_text: 'CUT'
    })
    expect(result.success).toBe(true)
  })

  it('parses result with null optional fields', () => {
    const result = RawHistoricalEventResultSchema.safeParse({
      dg_id: 18417,
      player_name: 'Scheffler, Scottie',
      fin_text: 'T23',
      earnings: null,
      fec_points: null,
      dg_points: null
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const result = RawHistoricalEventResultSchema.safeParse({
      dg_id: 18417,
      player_name: 'Scheffler, Scottie'
      // missing fin_text
    })
    expect(result.success).toBe(false)
  })
})

describe('RawHistoricalEventResultsResponseSchema', () => {
  const validResponse = {
    event_completed: '2025-04-13',
    tour: 'pga',
    season: 2025,
    year: 2025,
    event_name: 'Masters Tournament',
    event_id: '14',
    event_stats: [
      {
        dg_id: 10091,
        player_name: 'McIlroy, Rory',
        fin_text: '1',
        earnings: 4200000,
        fec_points: 750,
        dg_points: 28
      }
    ]
  }

  it('parses valid response', () => {
    const result = RawHistoricalEventResultsResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.event_stats).toHaveLength(1)
      expect(result.data.event_name).toBe('Masters Tournament')
    }
  })

  it('coerces string event_id to number', () => {
    const result = RawHistoricalEventResultsResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.event_id).toBe(14)
    }
  })

  it('accepts empty event_stats array', () => {
    const result = RawHistoricalEventResultsResponseSchema.safeParse({
      ...validResponse,
      event_stats: []
    })
    expect(result.success).toBe(true)
  })
})

// ---------- parseFinishText tests ----------

describe('parseFinishText', () => {
  it('parses numeric position "1"', () => {
    const result = parseFinishText('1')
    expect(result).toEqual({ position: 1, status: 'finished', displayText: '1st' })
  })

  it('parses numeric position "2"', () => {
    const result = parseFinishText('2')
    expect(result).toEqual({ position: 2, status: 'finished', displayText: '2nd' })
  })

  it('parses numeric position "3"', () => {
    const result = parseFinishText('3')
    expect(result).toEqual({ position: 3, status: 'finished', displayText: '3rd' })
  })

  it('parses numeric position "4"', () => {
    const result = parseFinishText('4')
    expect(result).toEqual({ position: 4, status: 'finished', displayText: '4th' })
  })

  it('parses numeric position "11" (special ordinal)', () => {
    const result = parseFinishText('11')
    expect(result).toEqual({ position: 11, status: 'finished', displayText: '11th' })
  })

  it('parses numeric position "21"', () => {
    const result = parseFinishText('21')
    expect(result).toEqual({ position: 21, status: 'finished', displayText: '21st' })
  })

  it('parses tied position "T5"', () => {
    const result = parseFinishText('T5')
    expect(result).toEqual({ position: 5, status: 'finished', displayText: 'T5' })
  })

  it('parses tied position "T23"', () => {
    const result = parseFinishText('T23')
    expect(result).toEqual({ position: 23, status: 'finished', displayText: 'T23' })
  })

  it('parses "CUT"', () => {
    const result = parseFinishText('CUT')
    expect(result).toEqual({ position: null, status: 'cut', displayText: 'CUT' })
  })

  it('parses "MC" as CUT', () => {
    const result = parseFinishText('MC')
    expect(result).toEqual({ position: null, status: 'cut', displayText: 'CUT' })
  })

  it('parses "MDF" as MDF (not CUT)', () => {
    const result = parseFinishText('MDF')
    expect(result).toEqual({ position: null, status: 'mdf', displayText: 'MDF' })
  })

  it('parses "WD"', () => {
    const result = parseFinishText('WD')
    expect(result).toEqual({ position: null, status: 'wd', displayText: 'WD' })
  })

  it('parses "DQ"', () => {
    const result = parseFinishText('DQ')
    expect(result).toEqual({ position: null, status: 'dq', displayText: 'DQ' })
  })

  it('handles lowercase input', () => {
    const result = parseFinishText('cut')
    expect(result).toEqual({ position: null, status: 'cut', displayText: 'CUT' })
  })

  it('handles whitespace', () => {
    const result = parseFinishText('  T5  ')
    expect(result).toEqual({ position: 5, status: 'finished', displayText: 'T5' })
  })
})

// ---------- Mapper tests ----------

describe('normalizeHistoricalEvent', () => {
  it('maps raw event to domain type', () => {
    const result = normalizeHistoricalEvent({
      calendar_year: 2025,
      date: '2025-04-10',
      event_id: 14,
      event_name: 'The Masters Tournament',
      tour: 'pga'
    })
    expect(result).toEqual({
      calendarYear: 2025,
      date: '2025-04-10',
      eventId: 14,
      eventName: 'The Masters Tournament',
      tour: 'pga'
    })
  })
})

describe('normalizeEventFinish', () => {
  it('maps raw result to domain type with formatted name', () => {
    const result = normalizeEventFinish({
      dg_id: 10091,
      player_name: 'McIlroy, Rory',
      fin_text: '1',
      earnings: 4200000,
      fec_points: 750,
      dg_points: 28
    })
    expect(result).toEqual({
      dgId: 10091,
      playerName: 'Rory McIlroy',
      finishPosition: 1,
      status: 'finished',
      finishText: '1st'
    })
  })

  it('handles CUT result', () => {
    const result = normalizeEventFinish({
      dg_id: 12345,
      player_name: 'Woods, Tiger',
      fin_text: 'CUT'
    })
    expect(result).toEqual({
      dgId: 12345,
      playerName: 'Tiger Woods',
      finishPosition: null,
      status: 'cut',
      finishText: 'CUT'
    })
  })

  it('strips embedded DG ID from player name', () => {
    const result = normalizeEventFinish({
      dg_id: 18417,
      player_name: 'Scheffler, Scottie (18417)',
      fin_text: 'T5'
    })
    expect(result.playerName).toBe('Scottie Scheffler')
  })

  it('handles single-name players gracefully', () => {
    const result = normalizeEventFinish({
      dg_id: 99999,
      player_name: 'Ryo',
      fin_text: 'T10'
    })
    expect(result.playerName).toBe('Ryo')
  })
})
