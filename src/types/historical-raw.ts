// Domain types for /historical-raw-data/* endpoints (camelCase)

export interface HistoricalRawEvent {
  calendarYear: number
  date: string
  eventId: number
  eventName: string
  hasSgCategories: boolean
  hasTraditionalStats: boolean
}

export interface RoundSummary {
  score: number
  courseName: string
  coursePar: number
  sgTotal: number | null
}

export interface HistoricalRawPlayerResult {
  dgId: number
  playerName: string
  finishPosition: number | null
  finishText: string
  status: 'finished' | 'cut' | 'mdf' | 'wd' | 'dq'
  totalScore: number | null
  totalPar: number | null
  rounds: (RoundSummary | null)[]
}
