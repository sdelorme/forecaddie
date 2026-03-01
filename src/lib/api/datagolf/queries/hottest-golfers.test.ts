import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getHottestGolfers } from './hottest-golfers'
import * as scheduleModule from './schedule'
import * as historicalModule from './historical-events'

vi.mock('./schedule')
vi.mock('./historical-events')

describe('getHottestGolfers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty map when no completed events', async () => {
    vi.mocked(scheduleModule.getSchedule).mockResolvedValue([
      {
        eventId: '1',
        startDate: '2025-03-01',
        isComplete: false,
        eventName: 'Test',
        country: '',
        course: '',
        courseKey: '',
        latitude: 0,
        location: '',
        longitude: 0,
        status: 'upcoming',
        winner: '',
        tournamentType: 'future',
        href: ''
      } as never
    ])
    const result = await getHottestGolfers()
    expect(result.size).toBe(0)
    expect(historicalModule.getHistoricalEventResults).not.toHaveBeenCalled()
  })

  it('aggregates finishes and treats CUT/WD/DQ as 70', async () => {
    vi.mocked(scheduleModule.getSchedule).mockResolvedValue([
      {
        eventId: '1',
        startDate: '2025-01-15',
        isComplete: true
      } as never,
      {
        eventId: '2',
        startDate: '2025-01-08',
        isComplete: true
      } as never
    ])
    vi.mocked(historicalModule.getHistoricalEventResults)
      .mockResolvedValueOnce([
        { dgId: 100, finishPosition: 5, status: 'finished' } as never,
        { dgId: 200, finishPosition: null, status: 'cut' } as never
      ])
      .mockResolvedValueOnce([
        { dgId: 100, finishPosition: 3, status: 'finished' } as never,
        { dgId: 200, finishPosition: null, status: 'wd' } as never
      ])

    const result = await getHottestGolfers()
    expect(result.get(100)).toBe(4) // (5 + 3) / 2 = 4
    expect(result.get(200)).toBe(70) // (70 + 70) / 2 = 70
  })

  it('excludes players with fewer than 2 finishes', async () => {
    vi.mocked(scheduleModule.getSchedule).mockResolvedValue([
      { eventId: '1', startDate: '2025-01-15', isComplete: true } as never
    ])
    vi.mocked(historicalModule.getHistoricalEventResults).mockResolvedValueOnce([
      { dgId: 100, finishPosition: 1, status: 'finished' } as never
    ])

    const result = await getHottestGolfers()
    expect(result.has(100)).toBe(false)
    expect(result.size).toBe(0)
  })

  it('includes players with exactly 2 finishes', async () => {
    vi.mocked(scheduleModule.getSchedule).mockResolvedValue([
      { eventId: '1', startDate: '2025-01-15', isComplete: true } as never,
      { eventId: '2', startDate: '2025-01-08', isComplete: true } as never
    ])
    vi.mocked(historicalModule.getHistoricalEventResults)
      .mockResolvedValueOnce([{ dgId: 100, finishPosition: 10, status: 'finished' } as never])
      .mockResolvedValueOnce([{ dgId: 100, finishPosition: 20, status: 'finished' } as never])

    const result = await getHottestGolfers()
    expect(result.get(100)).toBe(15)
  })
})
