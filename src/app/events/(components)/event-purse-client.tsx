'use client'

import { useState } from 'react'
import { formatPurse } from '@/lib/utils'
import { AddPurseButton } from '@/components/shared'

interface EventPurseClientProps {
  eventId: string
  season: number
  eventName: string
  initialPurse: number | null
}

export function EventPurseClient({ eventId, season, eventName, initialPurse }: EventPurseClientProps) {
  const [purse, setPurse] = useState(initialPurse)

  if (purse != null) {
    return <span className="tabular-nums">{formatPurse(purse)}</span>
  }

  return <AddPurseButton eventId={eventId} season={season} eventName={eventName} onPurseAdded={setPurse} />
}
