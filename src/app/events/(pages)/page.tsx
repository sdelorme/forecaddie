import { getSchedule } from '@/lib/api/datagolf'
import EventsUI from '../(components)/all-events'

export const metadata = {
  title: 'Tournament Schedule',
  description: 'Full PGA Tour tournament schedule with dates, courses, and locations.'
}

export default async function EventsPage() {
  const events = await getSchedule()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">PGA Tour Schedule</h1>
      </div>

      <EventsUI events={events} />
    </main>
  )
}
