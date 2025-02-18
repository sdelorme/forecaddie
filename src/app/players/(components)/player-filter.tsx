'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function PlayerFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter') || 'all'

  const handleFilterChange = (newFilter: string) => {
    router.push(`/players?filter=${newFilter}`)
  }

  return (
    <div className="mb-4">
      <label htmlFor="filter" className="mr-2 text-white">
        Filter:
      </label>
      <select
        id="filter"
        value={filter}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="border rounded p-2 bg-gray-800 text-white"
      >
        <option value="all">All Players</option>
        <option value="pro">Professional</option>
        <option value="amateur">Amateur</option>
      </select>
    </div>
  )
}
