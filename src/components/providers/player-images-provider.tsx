'use client'

import { useEffect } from 'react'
import { preloadPlayerImages } from '@/utils/player-images'

export function PlayerImagesProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Preload all player images when the app starts
    preloadPlayerImages()
  }, [])

  return <>{children}</>
} 