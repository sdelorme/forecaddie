'use client'

import { Button } from '@/components/ui'
import { usePlans } from '@/lib/supabase'
import { Loader2, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import PlanList from './(components)/plan-list'
import { PlanModal } from './(components)/plan-modal'

export default function DashboardPage() {
  const { plans, isLoading, error, createPlan, deletePlan } = usePlans()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreatePlan = async (name: string) => {
    await createPlan(name)
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-gray-400 mt-4">Loading your plans...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-lg">You haven&apos;t created any season maps yet</p>
          </div>
        </div>
      ) : (
        <PlanList plans={plans} onDeletePlan={deletePlan} />
      )}

      <PlanModal open={isModalOpen} onOpenChange={setIsModalOpen} onCreatePlan={handleCreatePlan} />
    </main>
  )
}
