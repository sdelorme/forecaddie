-- Fix infinite recursion in plan_members SELECT RLS policy.
-- Root cause: policy queried plan_members inside its own USING clause.

-- Helper function that checks membership without triggering RLS recursion.
CREATE OR REPLACE FUNCTION public.is_plan_member(target_plan_id uuid, target_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.plan_members pm
    WHERE pm.plan_id = target_plan_id
      AND pm.user_id = COALESCE(target_user_id, auth.uid())
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_plan_member(uuid, uuid) TO public;

-- Replace recursive select policy with function-based policy.
DROP POLICY IF EXISTS "plan_members: select if member" ON public.plan_members;

CREATE POLICY "plan_members: select if member" ON public.plan_members
  FOR SELECT TO public
  USING (public.is_plan_member(plan_id));
