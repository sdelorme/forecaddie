'use client'

import { ErrorFallback } from '@/components/shared'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LiveStatsError({ error, reset }: ErrorProps) {
  return (
    <ErrorFallback
      error={error}
      message="We couldn't load the live tournament data. This might be a temporary issue."
      onRetry={reset}
    />
  )
}
