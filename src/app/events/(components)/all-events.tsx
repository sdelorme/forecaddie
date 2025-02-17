// EventsUI.tsx (Dumb Component)
import Link from 'next/link'

type ProcessedEvent = {
  event_id: number
  event_name: string
  location: string
  start_date: string
  tournamentType: 'live' | 'historical' | 'future'
  href: string
  isComplete: boolean
}

export default function EventsUI({ events }: { events: ProcessedEvent[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Link key={event.event_id} href={event.href}>
          <div
            className={`
              cursor-pointer p-4 rounded-lg shadow-lg 
              transition-all duration-300 hover:scale-102
              h-full flex flex-col justify-between
              ${
                event.isComplete
                  ? 'bg-gray-800/50 text-gray-400'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }
            `}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold line-clamp-2 flex-grow">
                  {event.event_name}
                </h2>
                {event.isComplete && (
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded ml-2 flex-shrink-0">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm opacity-75 mb-2 line-clamp-1">
                {event.location}
              </p>
            </div>
            <p className="text-xs opacity-60 mt-auto">
              {new Date(event.start_date).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
