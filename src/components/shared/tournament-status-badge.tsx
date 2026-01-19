import { cn } from '@/lib/utils/class-name'

type TournamentStatusBadgeProps = {
  status: 'live' | 'final'
  size?: 'sm' | 'md'
}

export function TournamentStatusBadge({ status, size = 'sm' }: TournamentStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold uppercase tracking-wide rounded',
        size === 'sm' && 'px-1.5 py-0.5 text-[10px]',
        size === 'md' && 'px-2 py-1 text-xs',
        status === 'live' && 'bg-primary/20 text-primary animate-pulse',
        status === 'final' && 'bg-amber-600/20 text-amber-400'
      )}
    >
      {status === 'live' ? 'Live' : 'Final'}
    </span>
  )
}
