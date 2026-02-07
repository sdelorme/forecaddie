import { getSchedule } from '@/lib/api/datagolf/queries/schedule'
import { getPlayerList } from '@/lib/api/datagolf/queries/players'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PlanDetailClient } from './(components)/plan-detail-client'

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
    notFound()
  }

  const [planResult, events, players] = await Promise.all([
    supabase.from('season_plans').select('*').eq('id', id).single(),
    getSchedule(),
    getPlayerList()
  ])

  if (planResult.error || !planResult.data) {
    notFound()
  }

  const plan = planResult.data

  return (
    <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem-4rem)]">
      <PlanDetailClient planId={plan.id} planName={plan.name} season={plan.season} events={events} players={players} />
    </main>
  )
}
