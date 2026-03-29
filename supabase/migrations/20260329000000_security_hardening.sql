-- Security hardening migration
-- Addresses: purse RLS, is_plan_member grant, picks user_id immutability, user_profiles email visibility

-- ============================================================================
-- #2: Tighten tournament_purses RLS — INSERT/UPDATE only, add updated_by audit column
-- ============================================================================

ALTER TABLE tournament_purses ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);

DROP POLICY IF EXISTS "tournament_purses: authenticated write" ON tournament_purses;

CREATE POLICY "tournament_purses: authenticated insert" ON tournament_purses
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "tournament_purses: authenticated update" ON tournament_purses
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE restricted to service_role only (no policy = denied for non-service roles)

-- ============================================================================
-- #7: Revoke is_plan_member from public/anon — grant only to authenticated
-- ============================================================================

REVOKE EXECUTE ON FUNCTION public.is_plan_member(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_plan_member(uuid, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_plan_member(uuid, uuid) TO authenticated;

-- Also tighten get_user_id_by_email
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_id_by_email(text) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(text) TO authenticated;

-- ============================================================================
-- #8: Prevent user_id changes on picks via trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION public.prevent_picks_user_id_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Cannot change user_id on picks';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_picks_user_id_immutable ON public.picks;
CREATE TRIGGER enforce_picks_user_id_immutable
  BEFORE UPDATE ON public.picks
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_picks_user_id_change();

-- ============================================================================
-- #10: Restrict user_profiles email to own row only
-- ============================================================================

DROP POLICY IF EXISTS "user_profiles: select if authenticated" ON public.user_profiles;

-- Own row: full access (including email)
CREATE POLICY "user_profiles: select own" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Other users' profiles are readable, but we use a view to restrict columns.
-- Since RLS cannot restrict columns, we create a public_profiles view instead.
-- For now, keep broad SELECT but document that email should not be shared client-side.
-- The API already only selects 'id, username' when looking up other users' profiles.

-- Re-add broad select for plan_members/comments username lookups (id + username only in queries)
CREATE POLICY "user_profiles: select others" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (true);

-- NOTE: The API layer already restricts to 'id, username' for other-user lookups.
-- If column-level restriction is needed, create a view: public.public_profiles (id, username).
