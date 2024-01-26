import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <div className="card">
        <h1>Hello and welcome to Forecaddie</h1>
      </div>
      <button className="btn-primary m-2">
        <Link href="/events">Events Page</Link>
      </button>
      <button className="btn-secondary m-2">
        <Link href="/players">Players Page</Link>
      </button>
    </main>
  )
}
