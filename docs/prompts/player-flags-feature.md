# Player Flags Feature: Stars & Flags

## Session Goal

Rework the star (favorite) and flag functionality so they serve distinct, useful purposes across the leaderboard table and scrollable header leaderboard.

## Desired Behavior

### Stars (Favorites) — Season-long persistence

- **Purpose:** Mark players you care about all season (e.g., your OAD candidates, players you follow)
- **Persistence:** All season — once starred, stays starred until manually removed
- **Effect on leaderboard (both scrollable header AND full table):**
  - Starred players appear **first**, in a visually partitioned section at the top
  - Within the starred partition, sort by current position (same as normal sort)
  - Below the partition, remaining players sort normally by position
  - Partition should have a subtle visual separator (e.g., a thin border or background change)
- **Effect on scroll leaderboard:** Starred players scroll first (leftmost cards)
- **No change to database schema** — `player_flags.is_favorite` already persists per user per player

### Flags — Current tournament only

- **Purpose:** Temporarily mark players of interest for THIS tournament (e.g., players in your betting slips, matchup opponents)
- **Persistence:** Current tournament only — flags auto-clear when the active tournament changes
- **Effect on leaderboard:** Flagged players get a visual indicator (red flag icon) but do NOT affect sort order (they stay in position order). This distinguishes flags from stars.
- **Database change needed:** Add `event_id` column to `player_flags` for flags, so they're scoped to a tournament. When the current event changes, flagged players from old events are not shown.

## Current State (read these files for context)

### Data Flow

1. `src/lib/api/datagolf/mappers/leaderboard.ts` — `sortPlayers()` sorts by position then name. `mapToLeaderboard()` builds the full leaderboard. Players have `isFavorite: false, isFlagged: false` set here (overridden at render time by context).
2. `src/components/providers/leaderboard-scroll-wrapper.tsx` — Wraps `LeaderboardScroll` with `LiveStatsProvider` data.
3. `src/components/shared/leaderboard-scroll.tsx` — Renders horizontal scroll of `PlayerCard` components. Players rendered in order received (no re-sorting).
4. `src/components/shared/player-card.tsx` — Renders star/flag icons on desktop only. Uses `usePlayerFlagsContext()` for state.
5. `src/app/events/(components)/leaderboard-table.tsx` — Full leaderboard table. NO star/flag icons currently.
6. `src/app/events/(containers)/leaderboard-container.tsx` — Container for leaderboard table, uses `useLiveStats()`.

### Flags Infrastructure

7. `src/lib/supabase/hooks/use-player-flags.ts` — `usePlayerFlags()` hook. Manages `Map<dgId, {isFavorite, isFlagged}>`. Upserts to `player_flags` table.
8. `src/components/providers/player-flags-provider.tsx` — Context provider, wraps entire app in `layout.tsx`.
9. `src/lib/supabase/types.ts` — `PlayerFlag` type from `player_flags` table: `{ id, user_id, player_dg_id, is_favorite, is_flagged, created_at }`.
10. `src/types/leaderboard.ts` — `LeaderboardPlayer` type includes `isFavorite` and `isFlagged` booleans.

### Supporting Files

11. `src/components/shared/header.tsx` — Fixed header containing the scroll leaderboard.
12. `src/lib/utils/tour-events.ts` — `getCurrentEvent()` and `getNextEvent()` for determining active tournament.

## Implementation Plan

### Step 1: Database Schema Change

Add `event_id` column to `player_flags` for tournament-scoped flags:

```sql
ALTER TABLE player_flags ADD COLUMN event_id TEXT DEFAULT NULL;
```

Update the unique constraint to allow the same player to be flagged across events:

```sql
-- Drop existing constraint if it doesn't account for event_id
-- Then create: user can have one favorite (event_id NULL) and one flag per event
DROP INDEX IF EXISTS player_flags_user_player_unique;
CREATE UNIQUE INDEX player_flags_user_player_event_unique
  ON player_flags (user_id, player_dg_id, COALESCE(event_id, '__favorite__'));
```

**Alternative (simpler):** Keep favorites and flags in the same row since a player can be both starred AND flagged. But flags need event scoping. Consider whether to:

- (A) Add `event_id` to existing table — favorites have `event_id = NULL`, flags have `event_id = '{current_event}'`
- (B) Split into two tables: `player_favorites` (season-long) and `player_event_flags` (event-scoped)

Option B is cleaner semantically. Recommend B.

### Step 2: Update Hook — Split Favorites and Flags

Refactor `use-player-flags.ts` OR create two hooks:

- `usePlayerFavorites()` — manages season-long stars, queries `player_favorites` or `player_flags WHERE event_id IS NULL`
- `usePlayerEventFlags(eventId: string)` — manages tournament flags, queries `player_flags WHERE event_id = ?`

The context provider needs the current event ID to scope flags. Get it from `LiveStatsProvider` or pass it down.

### Step 3: Re-sort Leaderboard with Star Partitioning

Modify `sortPlayers()` in `src/lib/api/datagolf/mappers/leaderboard.ts` — OR, since favorite state is client-side (not available in the server mapper), the re-sorting must happen at the **component level** where `PlayerFlagsContext` is available.

**Best approach:** Create a `useSortedLeaderboard(players: LeaderboardPlayer[])` hook that:

1. Gets favorites from context
2. Partitions: `starred = players.filter(p => isFavorite(p.dgId))`, `rest = players.filter(p => !isFavorite(p.dgId))`
3. Each partition keeps existing position sort
4. Returns `[...starred, SEPARATOR, ...rest]` or `{ starred, rest }` for the component to render with a visual divider

Use this hook in:

- `LeaderboardScroll` (header scroll)
- `LeaderboardContainer` (full table)

### Step 4: Update UI Components

**`player-card.tsx`:**

- Show star/flag on mobile too (currently `hidden lg:flex`)
- Make icons smaller on mobile if needed

**`leaderboard-table.tsx`:**

- Add star/flag icon columns (or inline with player name)
- Render starred section with subtle background difference (e.g., `bg-yellow-900/10` for starred partition)
- Add a thin separator row between starred and non-starred sections

**`leaderboard-scroll.tsx`:**

- Consume the sorted/partitioned player list
- Add a subtle visual separator between starred and non-starred cards (e.g., a thin vertical divider or spacing gap)

### Step 5: Auto-clear Old Flags

When the active event changes (detected via `LiveStatsProvider` or `getCurrentEvent()`):

- Don't show flags from previous events
- Optionally: clean up old flag rows in the background (soft delete or actual delete)
- The hook should filter: only return flags where `event_id` matches the current tournament

## Quality Gates

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] Starring a player persists across page reloads and tournament changes
- [ ] Flagging a player only shows for the current tournament
- [ ] Starred players appear first in both scroll and table leaderboards
- [ ] Starred section has a visual partition/separator
- [ ] Flagged players show the flag icon but stay in position order
- [ ] Mobile users can see and use star/flag icons
- [ ] Un-starring moves the player back to normal sort position
- [ ] Old flags don't appear when a new tournament starts

## Audits to Run After Implementation

1. **Golf domain audit** (`golf-domain-auditor`): Verify star/flag behavior makes sense for OAD planning. Are the right defaults set? Does flagging per-tournament align with real betting workflows?
2. **Next.js architecture audit** (`nextjs-app-router-auditor`): Verify client/server boundaries are correct, especially around the re-sorting logic (must be client-side since flags are user-specific).
3. **Release hardening** (manual check): Ensure flag cleanup doesn't race with data loading, abort controllers are in place, and the new schema migration is safe.
