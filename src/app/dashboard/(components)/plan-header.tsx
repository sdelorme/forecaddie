'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { SharePlanModal } from './share-plan-modal'

interface PlanHeaderProps {
  planId: string
  planName: string
  season: number
  pickCount: number
  totalEvents: number
  canInvite: boolean
  currentUserId: string
}

export function PlanHeader({
  planId,
  planName,
  season,
  pickCount,
  totalEvents,
  canInvite,
  currentUserId
}: PlanHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false)
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareOpen(true)}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
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

      <SharePlanModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        planId={planId}
        canInvite={canInvite}
        currentUserId={currentUserId}
      />
    </div>
  )
}
