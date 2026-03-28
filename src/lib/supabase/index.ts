// Client-safe exports only (no next/headers)
// Server-only code must be imported directly from './server' or './auth'

// Re-export browser client
export { createClient } from './client'

// Re-export client hooks
export { useAuth } from './hooks/use-auth'
export { useComments, type CommentThread } from './hooks/use-comments'
export { useCommentCounts } from './hooks/use-comment-counts'
export { usePicks, type EventPicks } from './hooks/use-picks'
export { usePlans } from './hooks/use-plans'
export { usePlayerFlags } from './hooks/use-player-flags'

// Re-export types
export * from './types'
