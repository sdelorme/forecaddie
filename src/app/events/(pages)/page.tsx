import { getSchedule } from '@/lib/api/datagolf'
import { getPurseMap, attachPurses } from '@/lib/api/supabase/queries/tournament-purses'
import EventsUI from '../(components)/all-events'

export const metadata = {
  title: 'Tournament Schedule',
  description: 'Full PGA Tour tournament schedule with dates, courses, and locations.'
}

export default async function EventsPage() {
  const rawEvents = await getSchedule()
  const season =
    rawEvents.length > 0 ? new Date(rawEvents[0].startDate + 'T00:00:00').getFullYear() : new Date().getFullYear()
  const purseMap = await getPurseMap(season)
  const events = attachPurses(rawEvents, purseMap)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">PGA Tour Schedule</h1>
      </div>

      <EventsUI events={events} />
    </main>
  )
}
