'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/supabase/hooks/use-auth'
import { Button, Input, Label } from '@/components/ui'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { signInWithOtp, isLoading, error } = useAuth()
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    const { error } = await signInWithOtp(email.trim())

    if (!error) {
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <main className="container mx-auto px-4 py-16 min-h-[calc(100vh-4rem-4rem)]">
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-gray-400 mb-6">
              We sent a magic link to <span className="text-white font-medium">{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Click the link in your email to sign in. The link will expire in 1 hour.
            </p>
            <Button
              variant="ghost"
              className="mt-6 text-gray-400"
              onClick={() => {
                setIsSubmitted(false)
                setEmail('')
              }}
            >
              Use a different email
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-16 min-h-[calc(100vh-4rem-4rem)]">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in with your email to access your dashboard</p>
        </div>

        {(error || authError) && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">
              {error || (authError === 'auth_failed' ? 'Authentication failed. Please try again.' : authError)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !email.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending link...
              </>
            ) : (
              'Send magic link'
            )}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          No account? One will be created automatically when you sign in.
        </p>
      </div>
    </main>
  )
}
