import { notFound } from 'next/navigation'

type HistoricalEventStatsProps = {
  params: Promise<{
    'dg-event-id': string
  }>
}

// Validate that the event ID is numeric
function isValidEventId(id: string): boolean {
  return /^\d+$/.test(id)
}

// HistoricalEventStats component
// Displays historical event statistics based on the event ID
export default async function HistoricalEventStats({ params }: HistoricalEventStatsProps) {
  const resolvedParams = await params

  if (!isValidEventId(resolvedParams['dg-event-id'])) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-4">Historical Event Stats</h1>
      {/* Event content whenever I decide what that is */}
    </div>
  )
}
