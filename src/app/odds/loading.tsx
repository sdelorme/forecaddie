import { OddsSkeleton } from './(components)/odds-skeleton'

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="h-8 w-64 bg-gray-700 rounded mb-8 animate-pulse" />
      <OddsSkeleton />
    </main>
  )
}
