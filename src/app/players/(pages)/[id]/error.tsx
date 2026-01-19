'use client'

import { ErrorFallback } from '@/components/shared/error-fallback'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PlayerError({ error, reset }: ErrorProps) {
  return (
    <ErrorFallback
      error={error}
      message="We couldn't load the player details. This might be a temporary issue."
      onRetry={reset}
    />
  )
}
