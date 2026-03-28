'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Label } from '@/components/ui'
import { Loader2, AtSign, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const USERNAME_RE = /^[a-z0-9][a-z0-9_]*[a-z0-9]$/

function validateUsername(value: string): string | null {
  if (value.length < 3) return 'Must be at least 3 characters'
  if (value.length > 20) return 'Must be 20 characters or fewer'
  if (!USERNAME_RE.test(value)) return 'Only lowercase letters, numbers, and underscores'
  return null
}

export default function SetupPage() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const normalized = username.toLowerCase().replace(/\s/g, '_')
  const validationError = normalized.length > 0 ? validateUsername(normalized) : null
  const isValid = normalized.length >= 3 && !validationError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalized })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Something went wrong')
        setIsSubmitting(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-4rem-4rem)]">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pick a username</h1>
          <p className="text-gray-400">This is how others will see you in shared plans and comments.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(null)
                }}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                maxLength={20}
                autoFocus
                disabled={isSubmitting}
              />
              {normalized.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validationError ? (
                    <X className="h-4 w-4 text-red-400" />
                  ) : (
                    <Check className="h-4 w-4 text-green-400" />
                  )}
                </div>
              )}
            </div>
            {validationError && normalized.length > 0 && <p className="text-xs text-red-400">{validationError}</p>}
            {!validationError && normalized.length >= 3 && (
              <p className="text-xs text-gray-500">
                You&apos;ll appear as{' '}
                <span className={cn('font-medium', isValid ? 'text-white' : 'text-gray-400')}>@{normalized}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-600">You can change this later in settings.</p>
      </div>
    </div>
  )
}
