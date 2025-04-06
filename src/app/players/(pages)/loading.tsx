import { PlayersSkeleton } from '../(components)/players-skeleton'

export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">PGA Tour Players</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full">
          <PlayersSkeleton />
        </div>
        <div className="w-full lg:w-1/2 p-4">
          <div className="lg:sticky lg:top-8">
            <div className="h-[400px] bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  )
}
