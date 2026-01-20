'use client'

import { Trash2 } from 'lucide-react'
import type { SeasonPlan } from '@/lib/supabase/types'

interface PlanListProps {
  plans: SeasonPlan[]
  onDeletePlan: (id: string) => Promise<boolean>
}

export default function PlanList({ plans, onDeletePlan }: PlanListProps) {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this plan?')) {
      await onDeletePlan(id)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.id} className="bg-gray-800 rounded-lg p-6 group relative">
          <button
            onClick={(e) => handleDelete(e, plan.id)}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
            aria-label="Delete plan"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <h2 className="text-xl font-semibold text-white mb-2">{plan.name}</h2>
          <p className="text-gray-400 text-sm mb-4">{plan.season} Season</p>
          <div className="h-24 bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-500 text-sm">No picks yet</span>
          </div>
        </div>
      ))}
    </div>
  )
}
