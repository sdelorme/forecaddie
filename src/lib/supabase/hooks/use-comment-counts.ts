'use client'

import { useCallback, useEffect, useState } from 'react'

type CommentCounts = Record<string, number>

export function useCommentCounts(planId: string) {
  const [counts, setCounts] = useState<CommentCounts>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchCounts = useCallback(async () => {
    try {
      const res = await fetch(`/api/plans/${planId}/comment-counts`, {
        signal: AbortSignal.timeout(10_000)
      })
      if (!res.ok) return
      const data = await res.json()
      setCounts(data)
    } catch {
      // silent — counts are non-critical
    } finally {
      setIsLoading(false)
    }
  }, [planId])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  return { counts, isLoading, refetch: fetchCounts }
}
