'use client'

import { useState, useRef, useEffect } from 'react'
import { DollarSign, Check, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddPurseButtonProps {
  eventId: string
  season: number
  eventName: string
  onPurseAdded?: (purse: number) => void
  className?: string
}

export function AddPurseButton({ eventId, season, eventName, onPurseAdded, className }: AddPurseButtonProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleSave = async () => {
    const raw = value.replace(/[,$\s]/g, '')
    const purse = Number(raw)

    if (!purse || purse <= 0 || !Number.isInteger(purse)) {
      setError('Enter a valid amount')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/tournament-purses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dg_event_id: eventId,
          season,
          event_name: eventName,
          purse
        })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Failed to save')
        return
      }

      onPurseAdded?.(purse)
      setEditing(false)
      setValue('')
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setValue('')
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (!editing) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
        className={cn(
          'inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors',
          className
        )}
        title="Add purse amount"
      >
        <DollarSign className="h-3 w-3" />
        <span>Add purse</span>
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <span className="text-xs text-gray-400">$</span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. 9000000"
        disabled={saving}
        className={cn(
          'w-24 bg-gray-700 border rounded px-1.5 py-0.5 text-xs text-white placeholder-gray-500 outline-none focus:border-primary',
          error ? 'border-red-500' : 'border-gray-600'
        )}
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="p-0.5 text-green-400 hover:text-green-300 disabled:opacity-50"
        title="Save"
      >
        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
      </button>
      <button
        onClick={handleCancel}
        disabled={saving}
        className="p-0.5 text-gray-400 hover:text-gray-300 disabled:opacity-50"
        title="Cancel"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
