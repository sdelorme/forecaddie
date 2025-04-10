import PlanList from './(components)/plan-list'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default async function DashboardPage() {
  const seasonPlans: any[] = [] // Hardcoded empty array for now

  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-4rem)]">
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
      {seasonPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-lg">You haven&apos;t created any season maps yet</p>
            <Button variant="default" className="text-white gap-2">
              <PlusCircle className="h-4 w-4" />
              Create
            </Button>
          </div>
        </div>
      ) : (
        <PlanList />
      )}
    </main>
  )
}
