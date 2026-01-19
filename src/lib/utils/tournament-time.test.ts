import { describe, it, expect } from 'vitest'
import {
  getTournamentStartDate,
  getTournamentEndDate,
  isTournamentInProgress,
  isTournamentComplete,
  STANDARD_TOURNAMENT_DAYS
} from './tournament-time'

describe('getTournamentStartDate', () => {
  it('returns 5am ET converted to UTC for EDT dates (summer)', () => {
    // July 4, 2025 is during EDT (UTC-4)
    // 5am EDT = 9am UTC
    const date = getTournamentStartDate('2025-07-04')
    expect(date.getUTCHours()).toBe(9)
    expect(date.getUTCMonth()).toBe(6) // July is month 6 (0-indexed)
    expect(date.getUTCDate()).toBe(4)
  })

  it('returns 5am ET converted to UTC for EST dates (winter)', () => {
    // January 15, 2025 is during EST (UTC-5)
    // 5am EST = 10am UTC
    const date = getTournamentStartDate('2025-01-15')
    expect(date.getUTCHours()).toBe(10)
    expect(date.getUTCMonth()).toBe(0) // January is month 0
    expect(date.getUTCDate()).toBe(15)
  })

  it('handles DST transition correctly (spring forward)', () => {
    // March 9, 2025 is when clocks spring forward
    // Before 2am is EST, after is EDT
    // Tournament at 5am would be in EDT (UTC-4), so 5am EDT = 9am UTC
    const date = getTournamentStartDate('2025-03-09')
    expect(date.getUTCHours()).toBe(9)
  })

  it('handles DST transition correctly (fall back)', () => {
    // November 2, 2025 is when clocks fall back
    // After 2am is EST
    // Tournament at 5am would be in EST (UTC-5), so 5am EST = 10am UTC
    const date = getTournamentStartDate('2025-11-02')
    expect(date.getUTCHours()).toBe(10)
  })
})

describe('getTournamentEndDate', () => {
  it('returns end date 4 days after start', () => {
    const startDate = getTournamentStartDate('2025-07-04')
    const endDate = getTournamentEndDate('2025-07-04')

    const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    expect(daysDiff).toBeGreaterThanOrEqual(STANDARD_TOURNAMENT_DAYS)
  })
})

describe('isTournamentInProgress', () => {
  it('returns true when current date is within tournament window', () => {
    // Tournament starts July 4
    const duringTournament = new Date('2025-07-05T12:00:00Z')
    expect(isTournamentInProgress('2025-07-04', duringTournament)).toBe(true)
  })

  it('returns false when tournament has not started', () => {
    const beforeTournament = new Date('2025-07-03T12:00:00Z')
    expect(isTournamentInProgress('2025-07-04', beforeTournament)).toBe(false)
  })

  it('returns false when tournament has ended', () => {
    const afterTournament = new Date('2025-07-15T12:00:00Z')
    expect(isTournamentInProgress('2025-07-04', afterTournament)).toBe(false)
  })
})

describe('isTournamentComplete', () => {
  it('returns true when tournament has ended', () => {
    const afterTournament = new Date('2025-07-15T12:00:00Z')
    expect(isTournamentComplete('2025-07-04', afterTournament)).toBe(true)
  })

  it('returns false when tournament is in progress', () => {
    const duringTournament = new Date('2025-07-05T12:00:00Z')
    expect(isTournamentComplete('2025-07-04', duringTournament)).toBe(false)
  })
})
