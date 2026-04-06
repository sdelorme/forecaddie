'use client'

import { useState } from 'react'
import { formatPurse } from '@/lib/utils'
import { AddPurseButton } from '@/components/shared'
import { UserAddedPurse } from '@/components/shared/user-added-purse'

interface EventPurseClientProps {
  eventId: string
  season: number
  eventName: string
  initialPurse: number | null
  isUserAdded?: boolean
}

export function EventPurseClient({
  eventId,
  season,
  eventName,
  initialPurse,
  isUserAdded: initialIsUserAdded
}: EventPurseClientProps) {
  const [purse, setPurse] = useState(initialPurse)
  const [isUserAdded, setIsUserAdded] = useState(initialIsUserAdded ?? false)

  if (purse != null) {
    if (isUserAdded) {
      return <UserAddedPurse purse={purse} />
    }
    return <span className="tabular-nums">{formatPurse(purse)}</span>
  }

  return (
    <AddPurseButton
      eventId={eventId}
      season={season}
      eventName={eventName}
      onPurseAdded={(p) => {
        setPurse(p)
        setIsUserAdded(true)
      }}
    />
  )
}
