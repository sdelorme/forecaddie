-- Baseline migration: actual remote Supabase schema as of 2026-02-14
--
-- Consolidated from `supabase db pull`. Both the hand-written baseline and
-- the pulled diff were marked applied; this file replaces both.
--
-- To sync migration history after consolidation:
--   supabase migration repair --status reverted 20260214155011
--   supabase migration repair --status applied 00000000000000

-- ============================================================================
-- Functions
-- ============================================================================

create or replace function public.rls_auto_enable()
  returns event_trigger
  language plpgsql
  security definer
  set search_path to 'pg_catalog'
as $function$
declare
  cmd record;
begin
  for cmd in
    select *
    from pg_event_trigger_ddl_commands()
    where command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      and object_type in ('table', 'partitioned table')
  loop
    if cmd.schema_name is not null
       and cmd.schema_name in ('public')
       and cmd.schema_name not in ('pg_catalog', 'information_schema')
       and cmd.schema_name not like 'pg_toast%'
       and cmd.schema_name not like 'pg_temp%'
    then
      begin
        execute format('alter table if exists %s enable row level security', cmd.object_identity);
        raise log 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      exception
        when others then
          raise log 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      end;
    else
      raise log 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
    end if;
  end loop;
end;
$function$;

-- ============================================================================
-- Tables
-- ============================================================================

-- devices -------------------------------------------------------------------
create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

-- season_plans --------------------------------------------------------------
create table if not exists public.season_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  name text not null,
  season integer not null default 2025,
  device_id uuid references public.devices(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- picks ---------------------------------------------------------------------
create table if not exists public.picks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  plan_id uuid not null references public.season_plans(id) on delete cascade,
  event_id text not null,
  player_dg_id integer,
  result_position integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- player_flags --------------------------------------------------------------
create table if not exists public.player_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  player_dg_id integer not null,
  is_favorite boolean default false,
  is_flagged boolean default false,
  event_id text,
  device_id uuid references public.devices(id) on delete cascade,
  created_at timestamptz default now()
);

-- ============================================================================
-- Indexes
-- ============================================================================

create unique index if not exists picks_plan_id_event_id_key
  on public.picks using btree (plan_id, event_id);

create unique index if not exists picks_plan_event_unique
  on public.picks using btree (plan_id, event_id);

create unique index if not exists picks_plan_player_unique
  on public.picks using btree (plan_id, player_dg_id)
  where (player_dg_id is not null);

create unique index if not exists player_flags_user_player_unique
  on public.player_flags using btree (user_id, player_dg_id);

create unique index if not exists player_flags_device_id_player_dg_id_key
  on public.player_flags using btree (device_id, player_dg_id);

create index if not exists idx_season_plans_device_id
  on public.season_plans using btree (device_id);

create index if not exists idx_player_flags_device_id
  on public.player_flags using btree (device_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.devices enable row level security;
alter table public.season_plans enable row level security;
alter table public.picks enable row level security;
alter table public.player_flags enable row level security;

-- Note: the remote has both per-command AND "for all" policies on most tables.
-- This is redundant — the ALL policies are sufficient. Cleaning up the
-- per-command duplicates is deferred to a future migration.

-- devices: per-command policies
create policy "Users can create own devices" on public.devices
  for insert to public with check (user_id = auth.uid());
create policy "Users can read own devices" on public.devices
  for select to public using (user_id = auth.uid());
create policy "Users can update own devices" on public.devices
  for update to public using (user_id = auth.uid());

-- devices: ALL policy (redundant with above)
create policy "devices: user owns row" on public.devices
  for all to public using (user_id = auth.uid()) with check (user_id = auth.uid());

-- picks: per-command policies
create policy "Users can create own picks" on public.picks
  for insert to public with check (user_id = auth.uid());
create policy "Users can read own picks" on public.picks
  for select to public using (user_id = auth.uid());
create policy "Users can update own picks" on public.picks
  for update to public using (user_id = auth.uid());
create policy "Users can delete own picks" on public.picks
  for delete to public using (user_id = auth.uid());

-- player_flags: per-command policies
create policy "Users can create own flags" on public.player_flags
  for insert to public with check (user_id = auth.uid());
create policy "Users can read own flags" on public.player_flags
  for select to public using (user_id = auth.uid());
create policy "Users can update own flags" on public.player_flags
  for update to public using (user_id = auth.uid());
create policy "Users can delete own flags" on public.player_flags
  for delete to public using (user_id = auth.uid());

-- player_flags: ALL policy (redundant with above)
create policy "player_flags: user owns row" on public.player_flags
  for all to public using (user_id = auth.uid()) with check (user_id = auth.uid());

-- season_plans: per-command policies
create policy "Users can create own plans" on public.season_plans
  for insert to public with check (user_id = auth.uid());
create policy "Users can read own plans" on public.season_plans
  for select to public using (user_id = auth.uid());
create policy "Users can update own plans" on public.season_plans
  for update to public using (user_id = auth.uid());
create policy "Users can delete own plans" on public.season_plans
  for delete to public using (user_id = auth.uid());
