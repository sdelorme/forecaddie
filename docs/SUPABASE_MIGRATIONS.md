# Supabase Migration Workflow

All database schema and RLS policy changes are managed through migration files
in `supabase/migrations/`. Never edit tables or policies directly in the
Supabase Dashboard — that creates drift between the repo and the live database.

## Prerequisites

- **Supabase CLI** — install via Homebrew:
  ```bash
  brew install supabase/tap/supabase
  ```
- **Project ref** — find in Dashboard > Settings > General > Reference ID.
  Add to `.env.local`:
  ```
  SUPABASE_PROJECT_REF=<your_ref>
  ```

## First-time setup

```bash
# Link the CLI to your remote Supabase project
pnpm db:link
# You'll be prompted for the database password
```

After the initial link, mark the baseline migration as already applied so
`db push` doesn't try to re-run it against the existing remote schema:

```bash
supabase migration repair --status applied 00000000000000
```

## Day-to-day workflow

### 1. Create a migration

```bash
pnpm db:migrate:new add_some_column
# Creates supabase/migrations/<timestamp>_add_some_column.sql
```

### 2. Write the SQL

Edit the new file. Use idempotent DDL where practical (`IF NOT EXISTS`,
`IF EXISTS` guards). Never use `DROP TABLE` without an explicit rollback plan
discussed in the PR.

### 3. Apply to remote

```bash
pnpm db:migrate:up
```

### 4. Regenerate TypeScript types

```bash
pnpm db:gen-types
```

This overwrites `src/lib/supabase/types.generated.ts`. The convenience aliases
in `src/lib/supabase/types.ts` import from that file and survive regeneration.

### 5. Commit everything

```bash
git add supabase/migrations/ src/lib/supabase/types.generated.ts
git commit -m "add migration: add_some_column"
```

## Available scripts

| Script                       | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `pnpm db:link`               | Link CLI to remote Supabase project            |
| `pnpm db:migrate:new <name>` | Create a new migration file                    |
| `pnpm db:migrate:up`         | Push pending migrations to remote              |
| `pnpm db:migrate:status`     | List migrations and their applied status       |
| `pnpm db:pull`               | Pull remote schema into a new migration        |
| `pnpm db:gen-types`          | Regenerate TypeScript types from remote schema |

## Checking migration status

```bash
pnpm db:migrate:status
```

Shows which migrations have been applied to the remote database and which are
pending.

## Rollback strategy

Supabase migrations are **forward-only** — there is no automatic rollback. If a
migration needs to be reversed:

1. Create a new migration that undoes the change (`ALTER TABLE DROP COLUMN`,
   `DROP POLICY`, etc.).
2. Apply it via `pnpm db:migrate:up`.
3. Regenerate types and commit.

For emergencies, you can manually run SQL in the Supabase Dashboard SQL editor,
then capture the fix as a migration and mark it applied:

```bash
supabase migration repair --status applied <timestamp>
```

## Baseline migration

The `00000000000000_baseline.sql` file captures the schema that existed before
migration tracking began. It is marked as "applied" in the remote DB and will
not be re-executed. If you set up a fresh Supabase project, you can apply the
baseline to bootstrap the schema.

## Type generation details

- **Generated file:** `src/lib/supabase/types.generated.ts` — raw `Database`
  interface from `supabase gen types`. Committed to git so CI can typecheck
  without Supabase credentials.
- **Convenience file:** `src/lib/supabase/types.ts` — re-exports `Database` and
  `Json`, plus hand-written row/insert/update aliases (`SeasonPlan`, `Pick`,
  etc.). Not overwritten by generation.
- After schema changes, always run `pnpm db:gen-types` and commit the updated
  `types.generated.ts`.

## CI migration validation

CI includes a dedicated `migrations` job in `.github/workflows/ci.yml`:

1. `supabase start`
2. `supabase db reset --local --no-seed --yes`
3. `supabase gen types typescript --local --schema public`
4. Compare local generated output with committed `src/lib/supabase/types.generated.ts`

Notes:

- CI uses `--local` generation to avoid requiring Supabase cloud credentials.
- Local generation can differ from remote generation in metadata (for example,
  `__InternalSupabase`), so the CI comparison normalizes that metadata before
  checking drift.
- Formatting differences should not fail CI; schema/type drift should.
