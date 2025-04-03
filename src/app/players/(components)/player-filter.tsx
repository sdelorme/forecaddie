'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PlayerFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter') || 'all'

  const handleFilterChange = (newFilter: string) => {
    router.push(`/players?filter=${newFilter}`)
  }

  return (
    <div className="flex items-center gap-2 ">
      <Select value={filter} onValueChange={handleFilterChange}>
        <SelectTrigger className="w-[180px] cursor-pointer">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent className="[&_[data-highlighted]]:bg-primary [&_[data-highlighted]]:text-white">
          <SelectItem value="all" className="cursor-pointer">
            All Players
          </SelectItem>
          <SelectItem value="0" className="cursor-pointer">
            Professional
          </SelectItem>
          <SelectItem value="1" className="cursor-pointer">
            Amateur
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
