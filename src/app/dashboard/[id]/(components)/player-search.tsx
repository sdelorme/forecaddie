'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface PlayerSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function PlayerSearch({ value, onChange, placeholder = 'Search players...' }: PlayerSearchProps) {
  const [localValue, setLocalValue] = useState(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setLocalValue(next)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onChange(next)
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-gray-700 border-gray-600 pl-9 text-white placeholder:text-gray-400"
      />
    </div>
  )
}
