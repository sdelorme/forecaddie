import Link from 'next/link'
import { Suspense } from 'react'
import { Player } from '@/types/player'
import PlayersUI from '../(components)/all-players'

async function getPlayers(): Promise<Player[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/players/list`,
    {
      next: { 
        revalidate: 14400 // Revalidate every 4 hours
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch players')
  }

  const { players } = await response.json()
  return players
}

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">PGA Tour Players</h1>
        <Link 
          href="/" 
          className="text-secondary hover:underline"
        >
          Back to Home
        </Link>
      </div>
      
      <Suspense fallback={
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="bg-gray-800/50 h-32 rounded-lg"
            />
          ))}
        </div>
      }>
        <PlayersUI players={players} />
      </Suspense>
    </main>
  )
} 