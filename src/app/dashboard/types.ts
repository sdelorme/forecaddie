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
