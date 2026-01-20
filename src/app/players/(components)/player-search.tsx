'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input, Button } from '@/components/ui'

interface PlayerSearchProps {
  value: string
  onChange: (value: string) => void
}

export default function PlayerSearch({ value, onChange }: PlayerSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    setIsExpanded(false)
    onChange('')
  }

  return (
    <div className="flex items-center">
      {isExpanded ? (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search players..."
            value={value}
            onChange={handleChange}
            className="w-[200px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
          <Button variant="ghost" size="sm" onClick={handleClear} className="shrink-0 hover:bg-gray-700 h-9">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(true)} className="shrink-0 h-9">
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
