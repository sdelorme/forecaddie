'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui'
import { PlanPlayerTable } from './plan-player-table'
import { Button } from '@/components/ui/button'
import { X, Lock, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Player } from '@/types/player'
import type { Pick } from '@/lib/supabase/types'
import type { PlayerEventFinish } from '@/types/historical-events'
import type { EventPicks } from '@/lib/supabase'
import type { RecentFormMap } from '@/types/hottest-golfers'

interface PickDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventName: string | undefined
  selectedEventId: string | undefined
  players: Player[]
  usedPlayerIds: number[]
  futurePickEventNames?: Map<number, string>
  eventPicks: EventPicks
  historicalYears: number[]
  historicalFinishes: Map<number, PlayerEventFinish[]>
  isLoadingHistory: boolean
  withdrawnPlayerIds: Set<number>
  recentForm?: RecentFormMap
  onSelectPlayer: (playerDgId: number, slot: 1 | 2 | 3) => void
  onClearPick: (pick: Pick) => void
  readOnly?: boolean
}

function formatShortName(player: Player): string {
  const [lastName, firstName] = player.playerName.split(', ')
  if (!firstName) return player.displayName
  return `${firstName[0]}. ${lastName}`
}

export function PickDialog({
  open,
  onOpenChange,
  eventName,
  selectedEventId,
  players,
  usedPlayerIds,
  futurePickEventNames,
  eventPicks,
  historicalYears,
  historicalFinishes,
  isLoadingHistory,
  withdrawnPlayerIds,
  recentForm,
  onSelectPlayer,
  onClearPick,
  readOnly = false
}: PickDialogProps) {
  const [editingSlot, setEditingSlot] = useState<1 | 2 | 3>(1)

  const currentPick =
    editingSlot === 1 ? eventPicks.locked : editingSlot === 2 ? eventPicks.option1 : eventPicks.option2
  const consideredPlayerIds = [eventPicks.option1?.player_dg_id, eventPicks.option2?.player_dg_id].filter(
    (id): id is number => id != null && id !== currentPick?.player_dg_id
  )

  const handleSelectPlayer = (playerDgId: number) => {
    onSelectPlayer(playerDgId, editingSlot)
    onOpenChange(false)
  }

  const slotConfig: { slot: 1 | 2 | 3; label: string; pick: Pick | undefined }[] = [
    { slot: 1, label: 'Locked', pick: eventPicks.locked },
    { slot: 2, label: 'Option 1', pick: eventPicks.option1 },
    { slot: 3, label: 'Option 2', pick: eventPicks.option2 }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">{eventName ? `Pick for ${eventName}` : 'Select a player'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Locked pick consumes your OAD. Options are for planning only and do not consume players.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 mb-4">
          {slotConfig.map(({ slot, label, pick }) => {
            const isActive = editingSlot === slot
            const player = pick?.player_dg_id != null ? players.find((p) => p.dgId === pick.player_dg_id) : null
            const isLocked = slot === 1
            return (
              <div
                key={slot}
                role="button"
                tabIndex={0}
                onClick={() => setEditingSlot(slot)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setEditingSlot(slot)
                  }
                }}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors',
                  isActive ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-gray-500',
                  isLocked ? 'min-w-[140px]' : 'min-w-[120px]'
                )}
              >
                {isLocked ? (
                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                ) : (
                  <ListChecks className="h-3.5 w-3.5 text-slate-400" />
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-gray-500 block">{label}</span>
                  {player ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-white">{formatShortName(player)}</span>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (pick) onClearPick(pick)
                          }}
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          aria-label={`Clear ${label}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Select player</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <PlanPlayerTable
            players={players}
            usedPlayerIds={usedPlayerIds}
            futurePickEventNames={futurePickEventNames}
            onSelectPlayer={handleSelectPlayer}
            onClearPick={() => currentPick && onClearPick(currentPick)}
            currentPick={currentPick}
            selectedEventId={selectedEventId}
            selectedEventName={eventName}
            historicalYears={historicalYears}
            historicalFinishes={historicalFinishes}
            isLoadingHistory={isLoadingHistory}
            withdrawnPlayerIds={withdrawnPlayerIds}
            editingSlot={editingSlot}
            consideredPlayerIds={consideredPlayerIds}
            recentForm={recentForm}
            readOnly={readOnly}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
