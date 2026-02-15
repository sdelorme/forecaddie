-- Schema cleanup from 2026-02-14 data flow audit.
-- Covers Medium (data hygiene) and Low (performance/maintenance) items.
-- All operations are non-destructive; no data loss.

-- ============================================================================
-- 1. Add ON DELETE CASCADE to user_id foreign keys
-- ============================================================================
-- Prevents orphaned rows if an auth user is deleted.
-- PostgreSQL doesn't support ALTER CONSTRAINT, so we drop + re-add.

ALTER TABLE public.devices DROP CONSTRAINT devices_user_id_fkey;
ALTER TABLE public.devices
  ADD CONSTRAINT devices_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.season_plans DROP CONSTRAINT season_plans_user_id_fkey;
ALTER TABLE public.season_plans
  ADD CONSTRAINT season_plans_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.picks DROP CONSTRAINT picks_user_id_fkey;
ALTER TABLE public.picks
  ADD CONSTRAINT picks_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.player_flags DROP CONSTRAINT player_flags_user_id_fkey;
ALTER TABLE public.player_flags
  ADD CONSTRAINT player_flags_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================================================
-- 2. Fix season_plans.season default (was hardcoded to 2025)
-- ============================================================================

ALTER TABLE public.season_plans
  ALTER COLUMN season SET DEFAULT extract(year from now())::integer;

-- ============================================================================
-- 3. Drop duplicate unique index on picks
-- ============================================================================
-- picks_plan_event_unique is identical to picks_plan_id_event_id_key.

DROP INDEX IF EXISTS public.picks_plan_event_unique;

-- ============================================================================
-- 4. Add performance indexes for per-user queries
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_season_plans_user_id
  ON public.season_plans(user_id);

CREATE INDEX IF NOT EXISTS idx_picks_user_id
  ON public.picks(user_id);

-- ============================================================================
-- 5. Consolidate duplicate RLS policies
-- ============================================================================
-- devices and player_flags already have an ALL policy; just drop per-command.
-- picks and season_plans need an ALL policy created BEFORE dropping per-command
-- to avoid any access gap.

-- devices: keep "devices: user owns row" (ALL), drop per-command
DROP POLICY IF EXISTS "Users can create own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can read own devices" ON public.devices;
DROP POLICY IF EXISTS "Users can update own devices" ON public.devices;

-- player_flags: keep "player_flags: user owns row" (ALL), drop per-command
DROP POLICY IF EXISTS "Users can create own flags" ON public.player_flags;
DROP POLICY IF EXISTS "Users can read own flags" ON public.player_flags;
DROP POLICY IF EXISTS "Users can update own flags" ON public.player_flags;
DROP POLICY IF EXISTS "Users can delete own flags" ON public.player_flags;

-- picks: create ALL policy, then drop per-command
CREATE POLICY "picks: user owns row" ON public.picks
  FOR ALL TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own picks" ON public.picks;
DROP POLICY IF EXISTS "Users can read own picks" ON public.picks;
DROP POLICY IF EXISTS "Users can update own picks" ON public.picks;
DROP POLICY IF EXISTS "Users can delete own picks" ON public.picks;

-- season_plans: create ALL policy, then drop per-command
CREATE POLICY "season_plans: user owns row" ON public.season_plans
  FOR ALL TO public
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own plans" ON public.season_plans;
DROP POLICY IF EXISTS "Users can read own plans" ON public.season_plans;
DROP POLICY IF EXISTS "Users can update own plans" ON public.season_plans;
DROP POLICY IF EXISTS "Users can delete own plans" ON public.season_plans;
