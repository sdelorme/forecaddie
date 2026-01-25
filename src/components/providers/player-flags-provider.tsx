'use client'

import React, { createContext, useContext } from 'react'
import { usePlayerFlags } from '@/lib/supabase/hooks/use-player-flags'

type PlayerFlagState = {
  isFavorite: boolean
  isFlagged: boolean
}

type PlayerFlagsContextValue = {
  flags: Map<number, PlayerFlagState>
  isLoading: boolean
  error: string | null
  toggleFavorite: (playerDgId: number) => Promise<void>
  toggleFlag: (playerDgId: number) => Promise<void>
  getPlayerFlag: (playerDgId: number) => PlayerFlagState
}

const PlayerFlagsContext = createContext<PlayerFlagsContextValue | null>(null)

type PlayerFlagsProviderProps = {
  children: React.ReactNode
}

export function PlayerFlagsProvider({ children }: PlayerFlagsProviderProps) {
  const flagsState = usePlayerFlags()

  return <PlayerFlagsContext.Provider value={flagsState}>{children}</PlayerFlagsContext.Provider>
}

export function usePlayerFlagsContext() {
  const context = useContext(PlayerFlagsContext)

  // Return a default no-op implementation if not in provider (unauthenticated users)
  if (!context) {
    return {
      flags: new Map<number, PlayerFlagState>(),
      isLoading: false,
      error: null,
      toggleFavorite: async () => {},
      toggleFlag: async () => {},
      getPlayerFlag: () => ({ isFavorite: false, isFlagged: false })
    }
  }

  return context
}
