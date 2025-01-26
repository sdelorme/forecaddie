import Link from 'next/link'
import EventsUI from './components/all-events'

export default async function EventsPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/general/schedule`,
    {
      cache: 'no-store', // TODO: Update this since schedule is nearly static
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch events')
  } // TODO: Fallback UI

  const { events } = await response.json()

  return (
    <main>
      <h2>Heller this is the events page</h2>
      <Link href="/">Back to home Page</Link>
      <EventsUI events={events} />
    </main>
  )
}
