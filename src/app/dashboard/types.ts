export interface CompletedEventPodium {
  eventId: string
  eventName: string
  startDate: string
  course: string
  podium: { position: number; playerName: string }[]
}
