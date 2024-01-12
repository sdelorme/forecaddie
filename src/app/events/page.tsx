import Link from 'next/link'
import FetchEvents from './FetchEvents'

export default function EventsPage() {
  return (
    <main>
      <h2>Heller this is the events page</h2>
      <Link href="/">Back to home Page</Link>
      <FetchEvents />
    </main>
  )
}
