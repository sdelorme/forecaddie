-- Shared plans: plan_members table for multi-user access.
-- Roles: owner (full control), editor (can edit picks), viewer (read-only).

-- ============================================================================
-- 1. Create plan_members table
-- ============================================================================

CREATE TABLE public.plan_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.season_plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (plan_id, user_id)
);

CREATE INDEX idx_plan_members_plan_id ON public.plan_members(plan_id);
CREATE INDEX idx_plan_members_user_id ON public.plan_members(user_id);

-- ============================================================================
-- 2. Backfill: add owner for each existing season_plans row
-- ============================================================================

INSERT INTO public.plan_members (plan_id, user_id, role)
SELECT id, user_id, 'owner'
FROM public.season_plans
ON CONFLICT (plan_id, user_id) DO NOTHING;

-- ============================================================================
-- 3. Trigger: auto-add owner to plan_members on new plan insert
-- ============================================================================

CREATE OR REPLACE FUNCTION public.plan_members_add_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.plan_members (plan_id, user_id, role)
  VALUES (NEW.id, NEW.user_id, 'owner')
  ON CONFLICT (plan_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER plan_members_add_owner_trigger
  AFTER INSERT ON public.season_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.plan_members_add_owner();

-- ============================================================================
-- 4. Helper: lookup user id by email (for invite flow)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM auth.users WHERE email = lower(trim(user_email)) LIMIT 1;
$$;

-- ============================================================================
-- 5. RLS for plan_members
-- ============================================================================

ALTER TABLE public.plan_members ENABLE ROW LEVEL SECURITY;

-- SELECT: members can see other members of plans they belong to
CREATE POLICY "plan_members: select if member" ON public.plan_members
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = plan_members.plan_id AND pm.user_id = auth.uid()
    )
  );

-- INSERT: only owner/editor can invite
CREATE POLICY "plan_members: insert if owner or editor" ON public.plan_members
  FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = plan_members.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  );

-- DELETE: owner can remove anyone; user can remove themselves
CREATE POLICY "plan_members: delete if owner or self" ON public.plan_members
  FOR DELETE TO public
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = plan_members.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role = 'owner'
    )
  );

-- ============================================================================
-- 6. Replace season_plans RLS: access via plan_members
-- ============================================================================

DROP POLICY IF EXISTS "season_plans: user owns row" ON public.season_plans;

-- SELECT: any member can read
CREATE POLICY "season_plans: select if member" ON public.season_plans
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = season_plans.id AND pm.user_id = auth.uid()
    )
  );

-- UPDATE: owner/editor can update
CREATE POLICY "season_plans: update if owner or editor" ON public.season_plans
  FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = season_plans.id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = season_plans.id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  );

-- DELETE: owner only
CREATE POLICY "season_plans: delete if owner" ON public.season_plans
  FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = season_plans.id
        AND pm.user_id = auth.uid()
        AND pm.role = 'owner'
    )
  );

-- INSERT: still allow create for authenticated users (trigger adds owner)
CREATE POLICY "season_plans: insert own" ON public.season_plans
  FOR INSERT TO public
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 7. Replace picks RLS: member access, editor+ for mutations
-- ============================================================================

DROP POLICY IF EXISTS "picks: user owns row" ON public.picks;

-- SELECT: any plan member can read picks
CREATE POLICY "picks: select if member" ON public.picks
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = picks.plan_id AND pm.user_id = auth.uid()
    )
  );

-- INSERT: owner/editor can create; use auth.uid() for user_id
CREATE POLICY "picks: insert if editor or owner" ON public.picks
  FOR INSERT TO public
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = picks.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  );

-- UPDATE: owner/editor can update
CREATE POLICY "picks: update if editor or owner" ON public.picks
  FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = picks.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = picks.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  );

-- DELETE: owner/editor can delete
CREATE POLICY "picks: delete if editor or owner" ON public.picks
  FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.plan_members pm
      WHERE pm.plan_id = picks.plan_id
        AND pm.user_id = auth.uid()
        AND pm.role IN ('owner', 'editor')
    )
  );
