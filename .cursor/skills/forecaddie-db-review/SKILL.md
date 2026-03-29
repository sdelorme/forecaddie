---
name: forecaddie-db-review
description: Self-review checklist for Supabase database changes — migrations, generated types, RLS policies, convenience aliases, and CI compatibility. Use after creating or modifying migration files, after regenerating Supabase types, or before committing any database schema change.
---

# Skill: Forecaddie Database Change Review

Pre-push self-review for any change that touches Supabase schema, migrations, generated types, or RLS policies. Designed to catch the class of errors that break CI silently or at deploy time.

## When to trigger

- A new or modified file under `supabase/migrations/`
- Any change to `src/lib/supabase/types.generated.ts`
- Any change to `src/lib/supabase/types.ts` (convenience aliases)
- API routes that reference new Supabase tables/columns
- Auth callback or middleware changes that query `user_profiles` or similar

## Review checklist

Run through every item. Mark failures as **BLOCKER** and fix before continuing.

### 1. Migration file hygiene

- [ ] Filename follows `YYYYMMDDHHMMSS_description.sql` pattern
- [ ] Starts with a comment explaining purpose
- [ ] Uses `IF NOT EXISTS` / `IF EXISTS` for idempotent DDL where safe
- [ ] `ON DELETE CASCADE` is intentional (not default copy-paste)
- [ ] CHECK constraints have clear error semantics
- [ ] No raw user input interpolated (parameterized or escaped)

### 2. RLS policies

- [ ] `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` is present for every new table
- [ ] SELECT policy exists (otherwise table is invisible to all)
- [ ] INSERT/UPDATE/DELETE policies scope to `auth.uid()` or plan membership
- [ ] Policies reference `plan_members` via `EXISTS (SELECT 1 ...)` — not joins that could leak
- [ ] `TO public` or `TO authenticated` is explicit (not omitted)
- [ ] No recursive RLS: policies on `plan_members` must not query `plan_members` (use `is_plan_member()` function instead)

### 3. Generated types are in sync

This is the #1 CI failure cause. After any migration change:

```bash
# 1. Reset local DB to apply all migrations
supabase db reset

# 2. Regenerate types from local DB
pnpm db:gen-types:local

# 3. Verify the diff matches your expectations
git diff src/lib/supabase/types.generated.ts
```

**Verify:**

- [ ] New tables appear in `Database['public']['Tables']`
- [ ] New columns appear on existing tables (Row, Insert, Update)
- [ ] Column nullability matches migration (`DEFAULT` → optional in Insert; nullable → `| null`)
- [ ] No unrelated tables/columns disappeared (indicates local DB is behind)

### 4. Convenience aliases updated

File: `src/lib/supabase/types.ts`

- [ ] New tables have a `Row` alias (e.g., `export type MyTable = Database['public']['Tables']['my_table']['Row']`)
- [ ] Insert/Update aliases added if the table will be written to from app code
- [ ] No aliases reference tables that were removed or renamed

### 5. API routes compile against generated types

The Supabase client is fully typed via `types.generated.ts`. If a table or column is missing from generated types, `supabase.from('table_name')` will fail with:

```
Argument of type '"table_name"' is not assignable to parameter of type '"existing_table" | ...'
```

**Verify:**

- [ ] `pnpm typecheck` passes
- [ ] Every `.from('table_name')` in new/modified API routes references a table present in generated types

### 6. Build won't call external APIs at build time

Pages that `await` DataGolf or Supabase queries in server components will run those calls during `next build` unless opted out.

- [ ] Any page with server-side data fetching has `export const dynamic = 'force-dynamic'`
- [ ] Root layout (`src/app/layout.tsx`) has `export const dynamic = 'force-dynamic'` if it fetches data
- [ ] CI build uses dummy env vars (`DATA_GOLF_API_KEY: dummy_ci_key`) — real API calls will 403

### 7. CI pipeline compatibility

The `migrations` job in `.github/workflows/ci.yml`:

1. Starts local Supabase via Docker
2. Runs `supabase db reset --local --no-seed --yes` (replays all migrations)
3. Runs `pnpm db:gen-types:local` (regenerates types)
4. Runs `git diff --exit-code -- src/lib/supabase/types.generated.ts` (fails if uncommitted diff)

**This means:**

- [ ] Generated types committed to git must exactly match what local regen produces
- [ ] Migrations must replay cleanly from scratch (no manual state dependencies)
- [ ] The Supabase CLI version pinned in CI (`2.75.0`) may produce different type output than your local version — watch for cosmetic diffs like `__InternalSupabase` blocks

### 8. Remote DB alignment (pre-deploy)

Migrations not yet on the remote Supabase project won't affect production until pushed:

```bash
supabase migration list   # shows Local vs Remote status
supabase db push          # pushes pending migrations to remote
```

- [ ] All migrations in the PR are listed under "Local" in `supabase migration list`
- [ ] Before deploying, `supabase db push` has been run (or will be run as part of deploy)
- [ ] Destructive migrations (DROP, ALTER TYPE) have been tested on a branch DB first

## Quick-fix reference

| Symptom                                            | Cause                               | Fix                                               |
| -------------------------------------------------- | ----------------------------------- | ------------------------------------------------- |
| `'"table"' is not assignable to parameter of type` | Table missing from generated types  | `supabase db reset && pnpm db:gen-types:local`    |
| CI "generated types are committed" fails           | Local types don't match regen       | Reset, regen, commit the diff                     |
| `column 'x' does not exist on 'y'` in type errors  | Column missing from generated types | Same as above — migration wasn't applied locally  |
| Build timeout / 403 on API calls                   | Page does SSG with real API calls   | Add `export const dynamic = 'force-dynamic'`      |
| RLS "permission denied" at runtime                 | Missing or too-restrictive policy   | Check `ENABLE ROW LEVEL SECURITY` + policies      |
| Migration replay fails on CI                       | Migration depends on manual state   | Make migration idempotent (`IF NOT EXISTS`, etc.) |

## Output format

When reporting review results, use:

- **BLOCKER**: Must fix before commit/push (type errors, missing regen, broken RLS)
- **WARNING**: Should fix (missing aliases, cosmetic migration issues)
- **OK**: Passes check
