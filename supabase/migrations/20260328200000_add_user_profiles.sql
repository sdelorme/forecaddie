-- User profiles with unique usernames for identity across the app.
-- Auto-populated on signup via trigger; username is null until user picks one.

CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT username_format CHECK (
    username IS NULL
    OR (
      char_length(username) BETWEEN 3 AND 20
      AND username ~ '^[a-z0-9][a-z0-9_]*[a-z0-9]$'
    )
  )
);

CREATE INDEX idx_user_profiles_username ON public.user_profiles (username);

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read profiles (needed for comment attribution)
CREATE POLICY "user_profiles: select if authenticated" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "user_profiles: update own" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================================
-- Trigger: auto-create profile on signup (username starts null)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Backfill: create profiles for existing users (username null, set via UI)
-- ============================================================================

INSERT INTO public.user_profiles (id, email)
SELECT id, email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;
