import { PlayersSkeleton } from '../(components)/players-skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-8">PGA Tour Players</h1>
      <PlayersSkeleton />
    </div>
  )
}
