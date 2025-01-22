import moment from 'moment'
import { TourEvent, TourSchedule } from './types'

const SCHEDULE_URL = `https://feeds.datagolf.com/get-schedule?tour=pga&file_format=json&key=${process.env.DATA_GOLF_API_KEY}`

async function getEvents(): Promise<TourSchedule> {
  const response = await fetch(SCHEDULE_URL, { next: { revalidate: 86400 } })
  // refetch is daily for schedule
  return response.json()
}

async function sortEvents(scheduleOfEvents: TourSchedule) {
  const events = scheduleOfEvents.schedule
  return events.sort((a, b) => moment(a.start_date).diff(moment(b.start_date)))
}

export default async function FetchEvents() {
  const schedule = await getEvents()
  const sortedEvents = await sortEvents(schedule)
  const currentDate = moment()

  const renderTransparent = (startDate: string) => {
    const eventDate = moment(startDate)
    //if tournament is still live. Never more than 5 days with resched or playoff
    return currentDate.diff(eventDate, 'days') >= 5
  }
  return (
    <main>
      {sortedEvents.map((event: TourEvent) => (
        <div
          key={event.event_id}
          className={`card my-5 ${
            renderTransparent(event.start_date) ? 'card-secondary' : ''
          }`}
        >
          <h2>{event.event_id}</h2>
          <h2>{event.event_name}</h2>
          <p>{event.location}</p>
          <h3>{event.start_date}</h3>
        </div>
      ))}
    </main>
  )
}
