'use client'

import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import type { SeasonPlan } from '@/lib/supabase/types'

type PlanWithCount = SeasonPlan & { picks_count?: number }

interface PlanListProps {
  plans: PlanWithCount[]
  onDeletePlan: (id: string) => Promise<boolean>
}

export default function PlanList({ plans, onDeletePlan }: PlanListProps) {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this plan?')) {
      await onDeletePlan(id)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const count = plan.picks_count ?? 0

        return (
          <Link
            key={plan.id}
            href={`/dashboard/${plan.id}`}
            className="bg-gray-800 rounded-lg p-6 group relative cursor-pointer border border-transparent hover:border-green-700 transition-colors"
          >
            <button
              onClick={(e) => handleDelete(e, plan.id)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
              aria-label="Delete plan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <h2 className="text-xl font-semibold text-white mb-2">{plan.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{plan.season} Season</p>
            <p className="text-sm text-gray-500">
              {count > 0 ? `${count} pick${count === 1 ? '' : 's'} made` : 'No picks yet'}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
