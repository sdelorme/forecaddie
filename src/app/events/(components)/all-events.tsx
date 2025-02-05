'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { TourEvent } from '@/types/schedule'
import {
  getTournamentType,
  getEventHref
} from '@/utils/tour-events'

function isEventCompleted(startDate: string): boolean {
  // Assume event is completed if it started more than 4 days ago
  const eventDate = new Date(startDate)
  const fourDaysAgo = new Date()
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)
  return eventDate < fourDaysAgo
}

export default function EventsUI({ events }: { events: TourEvent[] }) {
  // Sort events: upcoming first, completed last
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aCompleted = isEventCompleted(a.start_date)
      const bCompleted = isEventCompleted(b.start_date)
      
      if (aCompleted && !bCompleted) return 1
      if (!aCompleted && bCompleted) return -1
      
      // If both are in the same completion state, sort by date
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    })
  }, [events])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedEvents.map((event) => {
        const tournamentType = getTournamentType(event, new Date())
        const href = getEventHref(event, tournamentType)
        const isComplete = isEventCompleted(event.start_date)

        return (
          <Link key={event.event_id} href={href}>
            <div
              className={`
                cursor-pointer p-4 rounded-lg shadow-lg 
                transition-all duration-300 hover:scale-102
                ${isComplete 
                  ? 'bg-gray-800/50 text-gray-400' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold line-clamp-2">
                  {event.event_name}
                </h2>
                {isComplete && (
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    Completed
                  </span>
                )}
              </div>
              <p className="text-sm opacity-75 mb-2">{event.location}</p>
              <p className="text-xs opacity-60">
                {new Date(event.start_date).toLocaleDateString()}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
