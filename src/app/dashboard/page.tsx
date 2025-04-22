'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import PlanList from './(components)/plan-list'
import { PlanModal } from './(components)/plan-modal'

interface SeasonPlan {
  id: string
  name: string
}

export default function DashboardPage() {
  const [seasonPlans, setSeasonPlans] = useState<SeasonPlan[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreatePlan = (name: string) => {
    const newPlan: SeasonPlan = {
      id: crypto.randomUUID(),
      name
    }
    setSeasonPlans([...seasonPlans, newPlan])
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Button variant="default" className="text-white gap-2" onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          Create
        </Button>
      </div>

      {seasonPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-lg">You haven&apos;t created any season maps yet</p>
          </div>
        </div>
      ) : (
        <PlanList plans={seasonPlans} />
      )}

      <PlanModal open={isModalOpen} onOpenChange={setIsModalOpen} onCreatePlan={handleCreatePlan} />
    </main>
  )
}
