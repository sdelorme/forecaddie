import { describe, it, expect } from 'vitest'
import { RawTourEventSchema, RawTourScheduleSchema } from './schedule'

describe('RawTourEventSchema', () => {
  // Valid test data matching DataGolf API response shape
  const validEvent = {
    country: 'United States',
    course: 'Pebble Beach Golf Links',
    course_key: 'pebble_beach',
    event_id: '401580344',
    event_name: 'AT&T Pebble Beach Pro-Am',
    latitude: 36.5725,
    location: 'Pebble Beach, CA',
    longitude: -121.9486,
    start_date: '2025-01-30',
    status: 'upcoming',
    tour: 'pga',
    winner: ''
  }

  it('parses valid event data', () => {
    const result = RawTourEventSchema.safeParse(validEvent)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.event_name).toBe('AT&T Pebble Beach Pro-Am')
    }
  })

  it('accepts all valid status values', () => {
    const statuses = ['upcoming', 'in_progress', 'completed'] as const
    for (const status of statuses) {
      const result = RawTourEventSchema.safeParse({ ...validEvent, status })
      expect(result.success).toBe(true)
    }
  })

  it('rejects invalid status', () => {
    const result = RawTourEventSchema.safeParse({
      ...validEvent,
      status: 'cancelled' // not a valid status
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const { event_id, ...missingId } = validEvent
    const result = RawTourEventSchema.safeParse(missingId)
    expect(result.success).toBe(false)
  })

  it('rejects wrong types', () => {
    const result = RawTourEventSchema.safeParse({
      ...validEvent,
      latitude: '36.5725' // should be number, not string
    })
    expect(result.success).toBe(false)
  })
})

describe('RawTourScheduleSchema', () => {
  const validSchedule = {
    tour: 'pga',
    season: 2025,
    schedule: [
      {
        country: 'United States',
        course: 'Pebble Beach Golf Links',
        course_key: 'pebble_beach',
        event_id: '401580344',
        event_name: 'AT&T Pebble Beach Pro-Am',
        latitude: 36.5725,
        location: 'Pebble Beach, CA',
        longitude: -121.9486,
        start_date: '2025-01-30',
        status: 'upcoming' as const,
        tour: 'pga',
        winner: ''
      }
    ]
  }

  it('parses valid schedule data', () => {
    const result = RawTourScheduleSchema.safeParse(validSchedule)
    expect(result.success).toBe(true)
  })

  it('accepts empty schedule array', () => {
    const result = RawTourScheduleSchema.safeParse({
      ...validSchedule,
      schedule: []
    })
    expect(result.success).toBe(true)
  })
})
