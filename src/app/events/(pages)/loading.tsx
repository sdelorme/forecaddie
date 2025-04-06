import { EventsSkeleton } from '../(components)/events-skeleton'

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-24 bg-gray-700 rounded animate-pulse" />
      </div>
      <EventsSkeleton />
    </main>
  )
}
