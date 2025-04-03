'use client'

import { useState, forwardRef, useImperativeHandle } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PlayerSearchProps {
  onChange: (value: string) => void
}

export interface PlayerSearchHandle {
  clear: () => void
}

const PlayerSearch = forwardRef<PlayerSearchHandle, PlayerSearchProps>(({ onChange }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useImperativeHandle(ref, () => ({
    clear: () => {
      setIsExpanded(false)
      setInputValue('')
    }
  }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onChange(value)
  }

  const handleClear = () => {
    setIsExpanded(false)
    setInputValue('')
    onChange('')
  }

  return (
    <div className="flex items-center">
      {isExpanded ? (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search players..."
            value={inputValue}
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
})

PlayerSearch.displayName = 'PlayerSearch'

export default PlayerSearch
