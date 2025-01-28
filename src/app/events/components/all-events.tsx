import Link from 'next/link'
import moment from 'moment'
import { TourEvent } from '@/types/schedule'
import {
  getTournamentType,
  getEventHref,
  isTransparent,
} from '@/utils/tour-events'

export default function EventsUI({ events }: { events: TourEvent[] }) {
  const currentDate = moment()

  return (
    <div>
      {events.map((event) => {
        const tournamentType = getTournamentType(event, currentDate)
        const href = getEventHref(event, tournamentType)

        return (
          <Link key={event.event_id} href={href} passHref>
            <div
              className={`cursor-pointer card my-5 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                isTransparent(event.start_date, currentDate)
                  ? 'bg-gray-200 opacity-50'
                  : 'bg-white'
              }`}
            >
              <h2 className="text-lg font-bold">{event.event_id}</h2>
              <h2 className="text-xl font-semibold">{event.event_name}</h2>
              <p className="text-gray-600">{event.location}</p>
              <h3 className="text-gray-500">{event.start_date}</h3>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
