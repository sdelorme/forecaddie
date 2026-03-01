'use client'

import { CircleHelp } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui'

export function RecentFormTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="How recent form is calculated"
          className="inline-flex items-center text-gray-500 hover:text-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <CircleHelp className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="center">
        <p className="font-medium text-gray-100 mb-1">Recent Form</p>
        <p>Average finish position over the last 5 completed PGA events. Lower is better.</p>
        <p className="mt-1 text-gray-400">
          CUT / WD / DQ / MDF count as 70th. Players need at least 2 finishes to appear.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
