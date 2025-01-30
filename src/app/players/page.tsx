import Link from 'next/link'
import FetchPlayers from './components/all-players'
import { Player } from '@/types/player'

export default async function PlayersPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/general/player-list`,
    {
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch players')
  }

  const playerList: Player[] = await response.json()

  return (
    <main>
      <p>Players page</p>
      <Link href="/">Back to home Page</Link>
      <FetchPlayers players={playerList} />
    </main>
  )
}
