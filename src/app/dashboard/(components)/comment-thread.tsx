'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, Reply, Pencil, Trash2, Send, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { CommentThread } from '@/lib/supabase'
import type { PlanComment } from '@/lib/supabase/types'

interface CommentThreadProps {
  planId: string
  eventId: string | null
  threads: CommentThread[]
  isLoading: boolean
  commentCount: number
  currentUserId: string
  readOnly: boolean
  onCreateComment: (body: string, parentId?: string) => Promise<PlanComment | null>
  onUpdateComment: (commentId: string, body: string) => Promise<PlanComment | null>
  onDeleteComment: (commentId: string) => Promise<boolean>
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return ''
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr = Math.floor(diffMs / 3_600_000)
  const diffDay = Math.floor(diffMs / 86_400_000)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatAuthorName(comment: PlanComment): string {
  const username = (comment as PlanComment & { username?: string | null }).username
  if (username) return `@${username}`
  return comment.user_id.slice(0, 8)
}

function CommentInput({
  placeholder,
  onSubmit,
  onCancel,
  autoFocus = false
}: {
  placeholder: string
  onSubmit: (body: string) => Promise<void>
  onCancel?: () => void
  autoFocus?: boolean
}) {
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    const trimmed = body.trim()
    if (!trimmed) return
    setSubmitting(true)
    await onSubmit(trimmed)
    setBody('')
    setSubmitting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape' && onCancel) {
      onCancel()
    }
  }

  return (
    <div className="flex gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={submitting}
        autoFocus={autoFocus}
        rows={1}
        className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-primary resize-none min-h-[32px]"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSubmit}
        disabled={submitting || !body.trim()}
        className="h-8 px-2 text-primary hover:text-primary/80"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
      {onCancel && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={submitting}
          className="h-8 px-2 text-gray-400 hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

function SingleComment({
  comment,
  isOwn,
  readOnly,
  isReply,
  onReply,
  onEdit,
  onDelete
}: {
  comment: PlanComment
  isOwn: boolean
  readOnly: boolean
  isReply: boolean
  onReply?: () => void
  onEdit: (commentId: string, body: string) => Promise<PlanComment | null>
  onDelete: (commentId: string) => Promise<boolean>
}) {
  const [editing, setEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const trimmed = editBody.trim()
    if (!trimmed || trimmed === comment.body) {
      setEditing(false)
      return
    }
    setSaving(true)
    await onEdit(comment.id, trimmed)
    setEditing(false)
    setSaving(false)
  }

  return (
    <div className={cn('group', isReply && 'ml-6 border-l border-gray-700 pl-3')}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium">{formatAuthorName(comment)}</span>
            <span className="text-gray-600">{formatRelativeTime(comment.created_at)}</span>
            {comment.updated_at && comment.updated_at !== comment.created_at && (
              <span className="text-gray-600 italic">edited</span>
            )}
          </div>

          {editing ? (
            <div className="mt-1 flex gap-2">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSave()
                  }
                  if (e.key === 'Escape') setEditing(false)
                }}
                disabled={saving}
                rows={1}
                autoFocus
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white outline-none focus:border-primary resize-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="h-7 px-1.5 text-primary"
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false)
                  setEditBody(comment.body)
                }}
                className="h-7 px-1.5 text-gray-400"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-200 mt-0.5 whitespace-pre-wrap break-words">{comment.body}</p>
          )}
        </div>

        {!editing && !readOnly && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {!isReply && onReply && (
              <button onClick={onReply} className="p-1 text-gray-500 hover:text-gray-300" title="Reply">
                <Reply className="h-3 w-3" />
              </button>
            )}
            {isOwn && (
              <>
                <button onClick={() => setEditing(true)} className="p-1 text-gray-500 hover:text-gray-300" title="Edit">
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="p-1 text-gray-500 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function CommentSection({
  threads,
  isLoading,
  commentCount,
  currentUserId,
  readOnly,
  onCreateComment,
  onUpdateComment,
  onDeleteComment
}: CommentThreadProps) {
  const [expanded, setExpanded] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const hasAutoExpanded = useRef(false)

  useEffect(() => {
    if (!hasAutoExpanded.current && !isLoading && commentCount > 0) {
      setExpanded(true)
      hasAutoExpanded.current = true
    }
  }, [isLoading, commentCount])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-1 py-2 text-xs text-gray-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Loading comments...</span>
      </div>
    )
  }

  return (
    <div className="border-t border-gray-700/50 pt-3">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-300 transition-colors"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <span>{commentCount === 0 ? 'Comments' : `${commentCount} comment${commentCount === 1 ? '' : 's'}`}</span>
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {threads.length === 0 && (
            <p className="text-xs text-gray-600 italic">No comments yet{readOnly ? '.' : ' — start the discussion.'}</p>
          )}

          {threads.map((thread) => (
            <div key={thread.id} className="space-y-2">
              <SingleComment
                comment={thread}
                isOwn={thread.user_id === currentUserId}
                readOnly={readOnly}
                isReply={false}
                onReply={() => setReplyingTo(replyingTo === thread.id ? null : thread.id)}
                onEdit={onUpdateComment}
                onDelete={onDeleteComment}
              />

              {thread.replies.map((reply) => (
                <SingleComment
                  key={reply.id}
                  comment={reply}
                  isOwn={reply.user_id === currentUserId}
                  readOnly={readOnly}
                  isReply
                  onEdit={onUpdateComment}
                  onDelete={onDeleteComment}
                />
              ))}

              {replyingTo === thread.id && !readOnly && (
                <div className="ml-6 pl-3 border-l border-gray-700">
                  <CommentInput
                    placeholder="Write a reply..."
                    autoFocus
                    onSubmit={async (body) => {
                      await onCreateComment(body, thread.id)
                      setReplyingTo(null)
                    }}
                    onCancel={() => setReplyingTo(null)}
                  />
                </div>
              )}
            </div>
          ))}

          {!readOnly && (
            <div className="pt-1">
              <CommentInput
                placeholder="Add a comment..."
                onSubmit={async (body) => {
                  await onCreateComment(body)
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
