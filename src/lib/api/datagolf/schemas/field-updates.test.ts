import { describe, it, expect } from 'vitest'
import { RawFieldPlayerSchema, RawFieldUpdatesResponseSchema } from './field-updates'
import { normalizeFieldPlayer, normalizeFieldUpdates } from '../mappers/field-updates'

// ---------- Schema tests ----------

describe('RawFieldPlayerSchema', () => {
  const validPlayer = {
    am: 0,
    country: 'USA',
    dg_id: 12577,
    dk_id: '15864340',
    dk_salary: 8200,
    early_late: 1,
    fd_id: '52085-78998',
    fd_salary: 10400,
    player_name: 'Woodland, Gary',
    r1_teetime: '7:40 AM',
    start_hole: 10
  }

  it('parses valid player data', () => {
    const result = RawFieldPlayerSchema.safeParse(validPlayer)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.dg_id).toBe(12577)
      expect(result.data.player_name).toBe('Woodland, Gary')
    }
  })

  it('parses player with minimal fields', () => {
    const minimal = {
      am: 0,
      country: 'USA',
      dg_id: 12577,
      player_name: 'Woodland, Gary'
    }
    const result = RawFieldPlayerSchema.safeParse(minimal)
    expect(result.success).toBe(true)
  })

  it('parses player with null optional fields', () => {
    const result = RawFieldPlayerSchema.safeParse({
      ...validPlayer,
      dk_id: null,
      dk_salary: null,
      early_late: null,
      fd_id: null,
      fd_salary: null,
      r1_teetime: null,
      start_hole: null
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const { dg_id, ...missingId } = validPlayer
    const result = RawFieldPlayerSchema.safeParse(missingId)
    expect(result.success).toBe(false)
  })

  it('rejects wrong types', () => {
    const result = RawFieldPlayerSchema.safeParse({
      ...validPlayer,
      am: 'no'
    })
    expect(result.success).toBe(false)
  })
})

describe('RawFieldUpdatesResponseSchema', () => {
  const validResponse = {
    course_name: 'El Camaleon Golf Club',
    current_round: 1,
    event_name: 'Mayakoba Golf Classic',
    field: [
      {
        am: 0,
        country: 'USA',
        dg_id: 12577,
        player_name: 'Woodland, Gary',
        r1_teetime: '7:40 AM',
        start_hole: 10,
        early_late: 1
      }
    ]
  }

  it('parses valid response', () => {
    const result = RawFieldUpdatesResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.event_name).toBe('Mayakoba Golf Classic')
      expect(result.data.field).toHaveLength(1)
    }
  })

  it('parses response with empty field array', () => {
    const result = RawFieldUpdatesResponseSchema.safeParse({
      ...validResponse,
      field: []
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing event_name', () => {
    const { event_name, ...missing } = validResponse
    const result = RawFieldUpdatesResponseSchema.safeParse(missing)
    expect(result.success).toBe(false)
  })
})

// ---------- Mapper tests ----------

describe('normalizeFieldPlayer', () => {
  it('normalizes a full player record', () => {
    const result = normalizeFieldPlayer({
      am: 0,
      country: 'USA',
      dg_id: 14139,
      dk_id: '123',
      dk_salary: 9000,
      early_late: 1,
      fd_id: '456',
      fd_salary: 10000,
      player_name: 'Thomas, Justin',
      r1_teetime: '8:15 AM',
      start_hole: 1
    })
    expect(result).toEqual({
      dgId: 14139,
      playerName: 'Justin Thomas',
      country: 'USA',
      teeTime: '8:15 AM',
      startHole: 1,
      wave: 'early',
      isAmateur: false
    })
  })

  it('formats "Last, First" to "First Last"', () => {
    const result = normalizeFieldPlayer({
      am: 0,
      country: 'NOR',
      dg_id: 18841,
      player_name: 'Hovland, Viktor',
      r1_teetime: null
    })
    expect(result.playerName).toBe('Viktor Hovland')
  })

  it('strips embedded DG IDs from player names', () => {
    const result = normalizeFieldPlayer({
      am: 0,
      country: 'USA',
      dg_id: 99999,
      player_name: 'Doe, John (99999)'
    })
    expect(result.playerName).toBe('John Doe')
  })

  it('maps early_late=2 to "late" wave', () => {
    const result = normalizeFieldPlayer({
      am: 0,
      country: 'USA',
      dg_id: 1,
      player_name: 'Test, Player',
      early_late: 2
    })
    expect(result.wave).toBe('late')
  })

  it('maps null early_late to null wave', () => {
    const result = normalizeFieldPlayer({
      am: 0,
      country: 'USA',
      dg_id: 1,
      player_name: 'Test, Player',
      early_late: null
    })
    expect(result.wave).toBeNull()
  })

  it('maps am=1 to isAmateur=true', () => {
    const result = normalizeFieldPlayer({
      am: 1,
      country: 'USA',
      dg_id: 1,
      player_name: 'Amateur, Young'
    })
    expect(result.isAmateur).toBe(true)
  })

  it('defaults missing tee time and start hole to null', () => {
    const result = normalizeFieldPlayer({
      am: 0,
      country: 'USA',
      dg_id: 1,
      player_name: 'Test, Player'
    })
    expect(result.teeTime).toBeNull()
    expect(result.startHole).toBeNull()
  })
})

describe('normalizeFieldUpdates', () => {
  it('normalizes the full response', () => {
    const result = normalizeFieldUpdates({
      course_name: 'Augusta National',
      current_round: 2,
      event_name: 'Masters Tournament',
      field: [
        {
          am: 0,
          country: 'USA',
          dg_id: 14139,
          player_name: 'Thomas, Justin',
          r1_teetime: '10:00 AM',
          early_late: 2,
          start_hole: 1
        }
      ]
    })

    expect(result.courseName).toBe('Augusta National')
    expect(result.currentRound).toBe(2)
    expect(result.eventName).toBe('Masters Tournament')
    expect(result.players).toHaveLength(1)
    expect(result.players[0].playerName).toBe('Justin Thomas')
    expect(result.players[0].wave).toBe('late')
  })

  it('handles empty field array', () => {
    const result = normalizeFieldUpdates({
      course_name: 'Test Course',
      current_round: 1,
      event_name: 'Test Event',
      field: []
    })
    expect(result.players).toEqual([])
  })
})
