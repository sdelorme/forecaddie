'use client'

import { SearchInput } from '@/components/shared'

interface PlayerSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function PlayerSearch({ value, onChange }: PlayerSearchProps) {
  return <SearchInput value={value} onChange={onChange} placeholder="Search players..." />
}
