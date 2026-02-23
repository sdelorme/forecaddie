'use client'

import { useCallback, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

type PlanMember = {
  id: string
  user_id: string
  role: string
  created_at: string | null
}

interface SharePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  canInvite: boolean
  currentUserId: string
}

function formatMemberDisplay(member: PlanMember, currentUserId: string): string {
  if (member.user_id === currentUserId) {
    return `You (${member.role})`
  }
  const shortId = member.user_id.slice(0, 8)
  return `${shortId}… (${member.role})`
}

export function SharePlanModal({ open, onOpenChange, planId, canInvite, currentUserId }: SharePlanModalProps) {
  const [members, setMembers] = useState<PlanMember[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removeLoading, setRemoveLoading] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/plans/${planId}/members`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setMembers(data)
    } catch {
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [planId])

  useEffect(() => {
    if (open) {
      fetchMembers()
      setInviteEmail('')
      setInviteError(null)
    }
  }, [open, fetchMembers])

  const handleInvite = async () => {
    const email = inviteEmail.trim().toLowerCase()
    if (!email) return
    setInviteLoading(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/plans/${planId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: inviteRole })
      })
      const data = await res.json()
      if (!res.ok) {
        setInviteError(data.error ?? 'Failed to invite')
        return
      }
      setInviteEmail('')
      fetchMembers()
    } catch {
      setInviteError('Failed to invite')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRemove = async (userId: string) => {
    setRemoveLoading(userId)
    try {
      const res = await fetch(`/api/plans/${planId}/members/${userId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to remove')
      fetchMembers()
    } catch {
      setInviteError('Failed to remove member')
    } finally {
      setRemoveLoading(null)
    }
  }

  const canRemove = (member: PlanMember): boolean => {
    if (member.user_id === currentUserId) return true
    const currentMember = members.find((m) => m.user_id === currentUserId)
    return currentMember?.role === 'owner'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share plan</DialogTitle>
          <DialogDescription>
            Invite others by email or manage members. Editors can edit picks; viewers are read-only.
          </DialogDescription>
        </DialogHeader>

        {canInvite && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={inviteLoading}
                />
              </div>
              <div className="w-24 space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as 'editor' | 'viewer')}>
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleInvite} disabled={inviteLoading || !inviteEmail.trim()}>
              {inviteLoading ? 'Inviting…' : 'Invite'}
            </Button>
            {inviteError && <p className="text-sm text-red-400">{inviteError}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label>Members</Label>
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <ul className="divide-y divide-gray-700 rounded-md border border-gray-700">
              {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between px-3 py-2 text-sm">
                  <span className="text-gray-200">{formatMemberDisplay(member, currentUserId)}</span>
                  {canRemove(member) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleRemove(member.user_id)}
                      disabled={removeLoading === member.user_id}
                    >
                      {removeLoading === member.user_id ? 'Removing…' : 'Remove'}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
