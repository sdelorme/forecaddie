'use client'

import { ErrorFallback } from '@/components/shared'

export default function PlanDetailError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFallback error={error} message="Something went wrong loading this plan." onRetry={reset} />
}
