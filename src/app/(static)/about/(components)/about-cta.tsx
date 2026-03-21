'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { useAuth } from '@/lib/supabase/hooks/use-auth'

export function AboutCta() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button asChild className="bg-secondary text-primary h-auto px-8 py-3 rounded-lg font-bold hover:bg-secondary/90">
        <Link href="/events/live-stats">Live Leaderboard</Link>
      </Button>
      <Button asChild className="bg-white text-primary h-auto px-8 py-3 rounded-lg font-bold hover:bg-white/90">
        <Link href={user ? '/dashboard' : '/login'}>{user ? 'OAD Planning' : 'Sign Up to Plan'}</Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        className="bg-black text-white h-auto px-8 py-3 rounded-lg font-bold hover:bg-black/80"
      >
        <Link href="/players">Player Rankings</Link>
      </Button>
    </div>
  )
}
