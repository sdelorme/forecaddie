import { getSchedule } from '@/lib/api/datagolf/queries/schedule'
import { getPlayerList } from '@/lib/api/datagolf/queries/players'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PlanDetailClient } from './(components)/plan-detail-client'
import type { ProcessedTourEvent } from '@/types/schedule'
import type { Player } from '@/types/player'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function PlanDetailPage({ params }: PageProps) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Plan fetch is critical — 404 if not found
  const planResult = await supabase.from('season_plans').select('*').eq('id', id).single()

  if (planResult.error || !planResult.data) {
    notFound()
  }

  const plan = planResult.data

  // DataGolf fetches degrade gracefully — empty arrays on failure
  let events: ProcessedTourEvent[] = []
  let players: Player[] = []

  try {
    const [scheduleResult, playerResult] = await Promise.allSettled([getSchedule(), getPlayerList()])
    events = scheduleResult.status === 'fulfilled' ? scheduleResult.value : []
    players = playerResult.status === 'fulfilled' ? playerResult.value : []
  } catch {
    // Both failed — continue with empty arrays
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-4rem)]">
      <PlanDetailClient planId={plan.id} planName={plan.name} season={plan.season} events={events} players={players} />
    </main>
  )
}
