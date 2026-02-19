export interface TopFinisher {
  playerName: string
  finishText: string
}

export interface CompletedEventResult {
  eventId: string
  eventName: string
  startDate: string
  course: string
  topFinishers: TopFinisher[]
}

export interface PriorYearTopFinishers {
  year: number
  topFinishers: TopFinisher[]
}

export interface OddsFavorite {
  playerName: string
  dgId: number
  odds: string
}

export interface EventOddsFavorites {
  eventName: string
  lastUpdated: string
  favorites: OddsFavorite[]
}
