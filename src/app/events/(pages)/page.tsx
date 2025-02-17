import Link from 'next/link'
import { Suspense } from 'react'
import { TourEvent } from '@/types/schedule'
import EventsUI from '../(components)/all-events'
import { processEvents } from '@/lib/utils/tour-events'

async function getEvents(): Promise<TourEvent[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/events/schedule`,
    {
      next: {
        revalidate: 14400, // Revalidate every 4 hours
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch events')
  }

  const { events } = await response.json()
  return events
}

export default async function EventsPage() {
  const events = await getEvents()
  const processedEvents = processEvents(events)

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
        <EventsUI events={processedEvents} />
      </Suspense>
    </main>
  )
}
