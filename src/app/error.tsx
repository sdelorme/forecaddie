'use client'

import { ErrorFallback } from '@/components/shared'

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFallback error={error} message="Something unexpected happened. Please try again." onRetry={reset} />
}
