// Domain types for historical event data (camelCase)

export interface HistoricalEventEntry {
  calendarYear: number
  date: string
  eventId: number
  eventName: string
  tour: string
}

export type FinishStatus = 'finished' | 'cut' | 'mdf' | 'wd' | 'dq'

export interface PlayerEventFinish {
  dgId: number
  playerName: string
  finishPosition: number | null
  status: FinishStatus
  finishText: string
  earnings: number | null
}
