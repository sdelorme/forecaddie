'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanHeaderProps {
  planName: string
  season: number
  pickCount: number
  totalEvents: number
}

export function PlanHeader({ planName, season, pickCount, totalEvents }: PlanHeaderProps) {
  const progress = totalEvents > 0 ? (pickCount / totalEvents) * 100 : 0

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to plans
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{planName}</h1>
          <span className="rounded-md bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300">{season}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {pickCount}/{totalEvents} picks made
          </span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-700">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-primary' : 'bg-transparent'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
