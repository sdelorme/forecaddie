'use client'

interface SeasonPlan {
  id: string
  name: string
}

interface PlanListProps {
  plans: SeasonPlan[]
}

export default function PlanList({ plans }: PlanListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.id} className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{plan.name}</h2>
          <div className="h-32 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  )
}
