'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input, Button } from '@/components/ui'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  width?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search...', width = 'w-[200px]' }: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${width} bg-gray-800 border-gray-700 text-white placeholder:text-gray-400`}
            autoFocus
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
