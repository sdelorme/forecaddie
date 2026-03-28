'use client'

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface YearSelectorProps {
  eventId: string
  availableYears: number[]
  currentYear: number | null
  currentSeasonYear: number
}

export function YearSelector({ eventId, availableYears, currentYear, currentSeasonYear }: YearSelectorProps) {
  const router = useRouter()

  const handleYearSelect = (year: number) => {
    if (year === currentSeasonYear && currentYear === null) return
    if (year === currentYear) return

    const href = year === currentSeasonYear ? `/events/${eventId}` : `/events/${eventId}?year=${year}`

    router.push(href)
  }

  const isActive = (year: number) => year === currentYear || (year === currentSeasonYear && currentYear === null)

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-gray-500 mr-1">Year:</span>
      {availableYears.map((year) => (
        <button
          key={year}
          onClick={() => handleYearSelect(year)}
          className={cn(
            'px-2.5 py-1 rounded text-xs font-medium transition-colors',
            isActive(year)
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-gray-300'
          )}
        >
          {year}
        </button>
      ))}
    </div>
  )
}
