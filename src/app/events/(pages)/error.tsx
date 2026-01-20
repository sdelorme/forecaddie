'use client'

import { ErrorFallback } from '@/components/shared'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function EventsError({ error, reset }: ErrorProps) {
  return (
    <ErrorFallback
      error={error}
      message="We couldn't load the tournament schedule. This might be a temporary issue."
      onRetry={reset}
    />
  )
}
