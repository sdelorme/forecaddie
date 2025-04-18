import Link from 'next/link'
import { ProcessedTourEvent } from '@/types/schedule'
import { formatTournamentDate } from '@/lib/utils/tournament-time'

export default function EventsUI({ events }: { events: ProcessedTourEvent[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Link key={event.eventId} href={event.href}>
          <div
            className={`
              cursor-pointer p-4 rounded-lg shadow-lg 
              transition-all duration-300 hover:scale-102
              h-full flex flex-col justify-between
              ${
                event.isComplete
                  ? 'bg-gray-800/50 text-gray-400'
                  : event.tournamentType === 'live'
                    ? 'bg-primary/20 text-white border border-secondary/30 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:bg-primary/30'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
              }
            `}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold line-clamp-2 flex-grow">{event.eventName}</h2>
                {event.isComplete ? (
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded ml-2 flex-shrink-0">
                    Completed
                  </span>
                ) : event.tournamentType === 'live' ? (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded ml-2 flex-shrink-0 animate-pulse">
                    Live
                  </span>
                ) : null}
              </div>
              <p className="text-sm opacity-75 mb-2 line-clamp-1">{event.location}</p>
            </div>
            <p className="text-xs opacity-60 mt-auto">{formatTournamentDate(event.startDate)}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
