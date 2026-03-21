'use client'

import { ErrorFallback } from '@/components/shared'

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFallback error={error} message="Something went wrong loading the dashboard." onRetry={reset} />
}
