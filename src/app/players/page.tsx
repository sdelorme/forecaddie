import Link from 'next/link'
import FetchPlayers from './FetchPlayers'

export default function PlayersPage() {
  return (
    <main>
      <p>Players page</p>
      <Link href="/">Back to home Page</Link>

      <FetchPlayers />
    </main>
  )
}
