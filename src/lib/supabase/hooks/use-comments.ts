'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PlanComment } from '../types'

export type CommentThread = PlanComment & {
  replies: PlanComment[]
}

type UseCommentsReturn = {
  threads: CommentThread[]
  isLoading: boolean
  error: string | null
  createComment: (body: string, parentId?: string) => Promise<PlanComment | null>
  updateComment: (commentId: string, body: string) => Promise<PlanComment | null>
  deleteComment: (commentId: string) => Promise<boolean>
  refetch: () => Promise<void>
  commentCount: number
}

function buildThreads(comments: PlanComment[]): CommentThread[] {
  const topLevel = comments.filter((c) => !c.parent_id)
  const replies = comments.filter((c) => c.parent_id)

  return topLevel.map((comment) => ({
    ...comment,
    replies: replies
      .filter((r) => r.parent_id === comment.id)
      .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''))
  }))
}

export function useComments(planId: string, eventId: string | null): UseCommentsReturn {
  const [comments, setComments] = useState<PlanComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(
    async (signal?: AbortSignal) => {
      if (!eventId) {
        setComments([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const timeoutSignal = AbortSignal.timeout(10_000)
        const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal

        const response = await fetch(`/api/plans/${planId}/comments?event_id=${encodeURIComponent(eventId)}`, {
          signal: combinedSignal
        })

        if (!response.ok) {
          throw new Error('Failed to fetch comments')
        }

        const data = await response.json()
        setComments(data)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.')
          return
        }
        console.error('Error fetching comments:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch comments')
      } finally {
        setIsLoading(false)
      }
    },
    [planId, eventId]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchComments(controller.signal)
    return () => controller.abort()
  }, [fetchComments])

  const createComment = useCallback(
    async (body: string, parentId?: string): Promise<PlanComment | null> => {
      if (!eventId) return null
      setError(null)

      try {
        const response = await fetch(`/api/plans/${planId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id: eventId,
            body,
            parent_id: parentId ?? null
          }),
          signal: AbortSignal.timeout(10_000)
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to create comment')
        }

        const newComment = await response.json()
        setComments((prev) => [...prev, newComment])
        return newComment
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return null
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.')
          return null
        }
        console.error('Error creating comment:', err)
        setError(err instanceof Error ? err.message : 'Failed to create comment')
        return null
      }
    },
    [planId, eventId]
  )

  const updateComment = useCallback(
    async (commentId: string, body: string): Promise<PlanComment | null> => {
      setError(null)

      try {
        const response = await fetch(`/api/plans/${planId}/comments/${commentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body }),
          signal: AbortSignal.timeout(10_000)
        })

        if (!response.ok) {
          throw new Error('Failed to update comment')
        }

        const updated = await response.json()
        setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)))
        return updated
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return null
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.')
          return null
        }
        console.error('Error updating comment:', err)
        setError(err instanceof Error ? err.message : 'Failed to update comment')
        return null
      }
    },
    [planId]
  )

  const deleteComment = useCallback(
    async (commentId: string): Promise<boolean> => {
      setError(null)

      try {
        const response = await fetch(`/api/plans/${planId}/comments/${commentId}`, {
          method: 'DELETE',
          signal: AbortSignal.timeout(10_000)
        })

        if (!response.ok) {
          throw new Error('Failed to delete comment')
        }

        setComments((prev) => prev.filter((c) => c.id !== commentId && c.parent_id !== commentId))
        return true
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return false
        if (err instanceof DOMException && err.name === 'TimeoutError') {
          setError('Request timed out. Please try again.')
          return false
        }
        console.error('Error deleting comment:', err)
        setError(err instanceof Error ? err.message : 'Failed to delete comment')
        return false
      }
    },
    [planId]
  )

  const threads = buildThreads(comments)

  return {
    threads,
    isLoading,
    error,
    createComment,
    updateComment,
    deleteComment,
    refetch: fetchComments,
    commentCount: comments.length
  }
}
