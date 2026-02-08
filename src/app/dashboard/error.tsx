'use client'

import { Button } from '@/components/ui'

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-4rem)]">
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-6">Something went wrong loading the dashboard.</p>
        <Button variant="default" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  )
}
