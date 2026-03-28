-- Per-event plan comments with single-level threading.
-- Comments are scoped to (plan_id, event_id) for contextual discussion.

CREATE TABLE public.plan_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.season_plans(id) ON DELETE CASCADE,
  event_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.plan_comments(id) ON DELETE CASCADE,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_plan_comments_plan_event ON public.plan_comments (plan_id, event_id);
CREATE INDEX idx_plan_comments_parent ON public.plan_comments (parent_id);

-- ============================================================================
-- RLS: access scoped through plan_members
-- ============================================================================

ALTER TABLE public.plan_comments ENABLE ROW LEVEL SECURITY;

-- SELECT: any plan member can read comments
CREATE POLICY "plan_comments: select if member" ON public.plan_comments
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = plan_comments.plan_id AND pm.user_id = auth.uid()
    )
  );

-- INSERT: owner/editor can create comments
CREATE POLICY "plan_comments: insert if editor or owner" ON public.plan_comments
  FOR INSERT TO public
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = plan_comments.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  );

-- UPDATE: only own comments, owner/editor role
CREATE POLICY "plan_comments: update own if editor or owner" ON public.plan_comments
  FOR UPDATE TO public
  USING (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = plan_comments.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = plan_comments.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  );

-- DELETE: own comments if editor/owner, or any comment if plan owner
CREATE POLICY "plan_comments: delete own or if plan owner" ON public.plan_comments
  FOR DELETE TO public
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = plan_comments.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role = 'owner'
    )
  );
