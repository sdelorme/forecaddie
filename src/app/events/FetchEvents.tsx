import Link from 'next/link'
import moment from 'moment'
import { TourEvent, TourSchedule } from './types'

const SCHEDULE_URL = `https://feeds.datagolf.com/get-schedule?tour=pga&file_format=json&key=${process.env.DATA_GOLF_API_KEY}`

async function getEvents(): Promise<TourSchedule> {
  const response = await fetch(SCHEDULE_URL, { next: { revalidate: 86400 } }) // Revalidate daily
  return response.json()
}

async function sortEvents(scheduleOfEvents: TourSchedule) {
  const events = scheduleOfEvents.schedule
  return events.sort((a, b) => moment(a.start_date).diff(moment(b.start_date)))
}

function getTournamentType(
  event: TourEvent,
  currentDate: moment.Moment
): 'live' | 'historical' | 'future' {
  const startDate = moment.utc(event.start_date, 'YYYY-MM-DD')
  const endDate = startDate.clone().add(5, 'days') // Assume tournaments last up to 5 days

  if (currentDate.isBetween(startDate, endDate, 'day', '[]')) {
    return 'live'
  }
  if (currentDate.isAfter(endDate)) {
    return 'historical'
  }
  return 'future'
}

export default async function FetchEvents() {
  const schedule = await getEvents()
  const sortedEvents = await sortEvents(schedule)
  const currentDate = moment()

  const renderTransparent = (startDate: string) => {
    const eventDate = moment.utc(startDate, 'YYYY-MM-DD')
    return currentDate.isAfter(eventDate.add(5, 'days')) // Mark as transparent if older than 5 days
  }

  return (
    <main>
      {sortedEvents.map((event: TourEvent) => {
        const tournamentType = getTournamentType(event, currentDate)
        let href = ''

        switch (tournamentType) {
          case 'live':
            href = `/events/live-stats`
            break
          case 'historical':
            href = `/events/${event.event_id}`
            break
          case 'future':
            href = `/events/future`
            break
        }

        return (
          <Link key={event.event_id} href={href} passHref>
            <div
              className={`cursor-pointer card my-5 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                renderTransparent(event.start_date)
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
    </main>
  )
}
