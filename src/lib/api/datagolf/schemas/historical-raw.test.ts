import { describe, it, expect } from 'vitest'
import { RawHistoricalRawEventListSchema, RawHistoricalRawRoundsResponseSchema } from './historical-raw'

describe('RawHistoricalRawEventListSchema', () => {
  it('validates a valid event list', () => {
    const data = [
      {
        calendar_year: 2021,
        date: '2021-06-20',
        event_id: 535,
        event_name: 'U.S. Open',
        sg_categories: 'yes',
        traditional_stats: 'yes',
        tour: 'pga'
      },
      {
        calendar_year: 2020,
        date: '2020-09-20',
        event_id: 26,
        event_name: 'U.S. Open',
        sg_categories: 'yes',
        traditional_stats: 'no',
        tour: 'pga'
      }
    ]

    const result = RawHistoricalRawEventListSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toHaveLength(2)
      expect(result.data[0].event_name).toBe('U.S. Open')
    }
  })

  it('rejects invalid entries', () => {
    const result = RawHistoricalRawEventListSchema.safeParse([{ calendar_year: 'bad' }])
    expect(result.success).toBe(false)
  })
})

describe('RawHistoricalRawRoundsResponseSchema', () => {
  it('validates a valid rounds response', () => {
    const data = {
      event_name: 'U.S. Open',
      event_id: '535',
      tour: 'pga',
      event_completed: '2021-06-20',
      year: 2021,
      season: 2021,
      sg_categories: 'yes',
      scores: [
        {
          dg_id: 19195,
          player_name: 'Rahm, Jon',
          fin_text: '1',
          round_1: {
            score: 69,
            course_name: 'Torrey Pines (South)',
            course_par: 71,
            sg_total: 4.718
          },
          round_2: {
            score: 70,
            course_name: 'Torrey Pines (South)',
            course_par: 71,
            sg_total: 2.5
          },
          round_3: null,
          round_4: null
        }
      ]
    }

    const result = RawHistoricalRawRoundsResponseSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.scores).toHaveLength(1)
      expect(result.data.scores[0].dg_id).toBe(19195)
    }
  })

  it('handles numeric event_id via coerce', () => {
    const data = {
      event_name: 'Test',
      event_id: 535,
      tour: 'pga',
      event_completed: '2021-06-20',
      year: 2021,
      season: 2021,
      sg_categories: 'yes',
      scores: []
    }

    const result = RawHistoricalRawRoundsResponseSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.event_id).toBe('535')
    }
  })

  it('rejects missing required fields', () => {
    const result = RawHistoricalRawRoundsResponseSchema.safeParse({ event_name: 'Test' })
    expect(result.success).toBe(false)
  })
})
