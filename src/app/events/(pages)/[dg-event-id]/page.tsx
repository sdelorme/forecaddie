import { notFound } from 'next/navigation'

interface Props {
  params: {
    'event-id': string
  }
}

// Validate that the event ID is numeric
function isValidEventId(id: string): boolean {
  return /^\d+$/.test(id)
}

export default function HistoricalEventStats({ params }: Props) {
  if (!isValidEventId(params['event-id'])) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-4">
        Historical Event Stats
      </h1>
      {/* Event content here */}
    </div>
  )
}
