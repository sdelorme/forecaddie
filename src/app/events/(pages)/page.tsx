import Link from 'next/link'
import { Suspense } from 'react'
import { getSchedule } from '@/lib/api/datagolf'
import EventsUI from '../(components)/all-events'

export default async function EventsPage() {
  const events = await getSchedule()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">PGA Tour Schedule</h1>
        <Link href="/" className="text-secondary hover:underline">
          Back to Home
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 h-32 rounded-lg" />
            ))}
          </div>
        }
      >
        <EventsUI events={events} />
      </Suspense>
    </main>
  )
}
