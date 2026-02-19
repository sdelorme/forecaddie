'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui'
import { PlanPlayerTable } from './plan-player-table'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'
import type { PlayerEventFinish } from '@/types/historical-events'

interface PickDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventName: string | undefined
  selectedEventId: string | undefined
  players: Player[]
  usedPlayerIds: number[]
  currentPick: Pick | undefined
  historicalYears: number[]
  historicalFinishes: Map<number, PlayerEventFinish[]>
  isLoadingHistory: boolean
  withdrawnPlayerIds: Set<number>
  onSelectPlayer: (playerDgId: number) => void
  onClearPick: () => void
}

export function PickDialog({
  open,
  onOpenChange,
  eventName,
  selectedEventId,
  players,
  usedPlayerIds,
  currentPick,
  historicalYears,
  historicalFinishes,
  isLoadingHistory,
  withdrawnPlayerIds,
  onSelectPlayer,
  onClearPick
}: PickDialogProps) {
  const handleSelectPlayer = (playerDgId: number) => {
    onSelectPlayer(playerDgId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">{eventName ? `Pick for ${eventName}` : 'Select a player'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a player for this event. Each player can only be used once per season.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0">
          <PlanPlayerTable
            players={players}
            usedPlayerIds={usedPlayerIds}
            onSelectPlayer={handleSelectPlayer}
            onClearPick={onClearPick}
            currentPick={currentPick}
            selectedEventId={selectedEventId}
            selectedEventName={eventName}
            historicalYears={historicalYears}
            historicalFinishes={historicalFinishes}
            isLoadingHistory={isLoadingHistory}
            withdrawnPlayerIds={withdrawnPlayerIds}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
