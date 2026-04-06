'use client'

import { Info } from 'lucide-react'
import { formatPurse } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui'

interface UserAddedPurseProps {
  purse: number
}

export function UserAddedPurse({ purse }: UserAddedPurseProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 tabular-nums cursor-help">
          {formatPurse(purse)}
          <Info className="h-3 w-3 text-amber-500/70" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>This purse was added by a user and has not been officially verified.</p>
      </TooltipContent>
    </Tooltip>
  )
}
