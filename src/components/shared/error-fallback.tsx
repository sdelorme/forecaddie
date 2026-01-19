'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  title?: string
  message: string
  onRetry: () => void
}

export function ErrorFallback({ error, title = 'Something went wrong', message, onRetry }: ErrorFallbackProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    // TODO: Replace with Sentry or similar when integrated
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-400 mb-6">{message}</p>
        <Button onClick={onRetry} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  )
}
