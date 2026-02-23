# MVP Scope Execution Plan

Based on UX demo feedback. Five scope changes with findings, assumptions, and paste-ready workflows.

**To execute this plan:** Use the comprehensive prompt in [MVP-SCOPE-EXECUTION-PROMPT.md](./MVP-SCOPE-EXECUTION-PROMPT.md), which orchestrates the workflow planner, backlog implementer, and specialist agents.

---

## 1. Hottest golfers

### Findings

**DataGolf API:** No dedicated "hottest golfers" or "recent form" endpoint in the [documented API](https://datagolf.com/api-access). The Trend Table (last 20 rounds, last 5 starts, SG moving averages) is a web feature, not exposed via API.

**Existing data we can use:**

- `getHistoricalEventList()` — event list with IDs
- `getHistoricalEventResults(eventId, year)` — per-event finishes (`dg_id`, `fin_text`, `earnings`)
- Schedule (`getSchedule()`) — completed events with `event_id`, `start_date`

**Manual calculation approach:**

1. Get schedule for current season; filter to completed events; sort by date desc; take last N (e.g. 5).
2. For each event, call `getHistoricalEventResults(eventId, year)` (year from schedule).
3. Map `fin_text` → numeric position (use `parseFinishText` from `mappers/historical-events.ts`).
4. Aggregate: for each player, compute average finish position over events they played.
5. Sort by avg position ascending; return top X golfers.

**Complexity:** Medium. Main cost: N+1 API calls for N recent events. Mitigation: batch in a server action or API route; cache per-season.

### Assumptions

- "Hottest" = best average finish in last 5 tournaments (configurable).
- Only include players with at least 2 finishes (avoid one-off noise).
- CUT/WD/DQ/MDF: treat as position 70 (or configurable penalty) for averaging.

### Execution Plan

| Step | Action                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Create `src/lib/api/datagolf/queries/hottest-golfers.ts` (or `recent-form.ts`) — server-side aggregation using existing historical queries |
| 2    | Add types in `types/`, schema in `schemas/`, mapper if needed                                                                              |
| 3    | Add API route `/api/hottest-golfers` or include in plan detail page data                                                                   |
| 4    | Add "Hottest" column or sort option to `PlanPlayerTable` / `PlanSeasonTable`                                                               |

**Command:** None specific. Use `backlog-implementer` with DataGolf skill.

**Subagent:** `backlog-implementer` (Claude 4.5 Opus)

**Paste-ready prompt:**

```
Implement "hottest golfers" for OAD planning: compute average finish position over the last 5 completed PGA events using getHistoricalEventResults. Add a server-side query in src/lib/api/datagolf/queries/ that aggregates by player, treats CUT/WD/DQ as position 70, requires min 2 finishes. Expose via API route and add a sortable "Recent form" column or section to the plan player table. Follow DataGolf skill: types → schemas → queries → mappers.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`, `pnpm test:run`

---

## 2. Shared plans

### Current state

- **Tables:** `season_plans` (user_id, name, season), `picks` (user_id, plan_id, event_id, player_dg_id)
- **RLS:** All policies use `user_id = auth.uid()` — plans and picks are strictly per-user
- **Auth:** Supabase Auth (email OTP); `authenticateRoute()` returns `{ supabase, user }`

### Plan for shared plans

1. **New table:** `plan_members`

   - `id`, `plan_id` (FK), `user_id` (FK), `role` ('owner'|'editor'|'viewer'), `created_at`
   - Unique (plan_id, user_id)

2. **Migration:** Create `plan_members`; backfill: insert (plan_id, user_id, 'owner') for each existing plan from `season_plans.user_id`

3. **RLS:**

   - `season_plans`: allow SELECT/UPDATE/DELETE if user is in `plan_members` for that plan
   - `picks`: allow CRUD if user is in `plan_members` for the plan (with role check: editor+ can mutate)

4. **API:**

   - Plans list: join `plan_members` or use RLS
   - Add `POST /api/plans/[id]/invite` (email → lookup user → insert plan_members)
   - Add `DELETE /api/plans/[id]/members/[userId]` for remove

5. **UI:** Plan settings → "Share" → invite by email; list members with roles

### Assumptions

- Invite by email only (no public links for MVP).
- Owner can remove members; editors can edit picks; viewers read-only.
- No real-time collaboration (refresh to see changes).

### Execution Plan

| Step | Action                                                |
| ---- | ----------------------------------------------------- |
| 1    | Design `plan_members` schema; create migration        |
| 2    | Update RLS policies for `season_plans` and `picks`    |
| 3    | Add invite API route; update plans API to use new RLS |
| 4    | Add Share UI in plan header/settings                  |

**Command:** None. Multi-step; start with schema.

**Subagent:** `backlog-implementer` (Claude 4.5 Opus) for schema + API; `nextjs-app-router-auditor` for RLS/security review.

**Paste-ready prompt:**

```
Add shared plans: create plan_members table (plan_id, user_id, role: owner|editor|viewer). Migration to create table and backfill owners from season_plans. Update RLS so season_plans and picks allow access when user is in plan_members. Add POST /api/plans/[id]/invite (email, role) and DELETE /api/plans/[id]/members/[userId]. Add Share button in plan header that opens a modal to invite by email and list members. Editors can edit picks; viewers read-only.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`, manual RLS testing in Supabase

---

## 3. Three players per tournament (1 locked + 2 options)

### Current state

- `picks` table: unique `(plan_id, event_id)` — one row per event
- `player_dg_id` — single player
- OAD: unique `(plan_id, player_dg_id)` where player_dg_id not null

### Schema change

Add `slot` column to `picks`:

- `slot` integer: 1 = locked, 2 = option 1, 3 = option 2
- Unique constraint: `(plan_id, event_id, slot)` — allows 3 rows per event
- OAD: only **locked** picks (slot 1) consume the player; API enforces uniqueness on (plan_id, player_dg_id) for slot=1 only

**Migration:**

```sql
ALTER TABLE picks ADD COLUMN slot integer DEFAULT 1;
-- Backfill: existing rows are slot 1 (locked)
CREATE UNIQUE INDEX picks_plan_event_slot_unique ON picks (plan_id, event_id, slot);
-- Drop old unique (plan_id, event_id) — replaced by (plan_id, event_id, slot)
```

### API / client changes

- `CreatePickSchema`: add `slot` (1|2|3), default 1
- `POST /api/plans/[id]/picks`: allow multiple picks per event (different slots)
- `GET` picks: return all; client groups by event
- `getPickForEvent` → `getPicksForEvent` returning `{ locked?: Pick; option1?: Pick; option2?: Pick }`
- UI: show locked pick + two option slots. Locked = "used" (consumes OAD). Options = "considered" (highlight with consistent color; do not consume OAD).

### Domain clarification

**Chosen:** Only the **locked** pick counts as used for OAD. Option 1 and Option 2 are "considered" alternatives — they do NOT consume the player. Highlight option slots with a consistent "considered" color (distinct from "used").

### Execution Plan

| Step | Action                                                                                  |
| ---- | --------------------------------------------------------------------------------------- |
| 1    | Migration: add `slot`, new unique index                                                 |
| 2    | Update `CreatePickSchema`, `UpdatePickSchema`; API routes                               |
| 3    | Update `usePicks`: `getPicksForEvent(eventId)`, `createPick(eventId, playerDgId, slot)` |
| 4    | Update `PlanPlayerTable`, `PlanSeasonTable`, `PlanEventList`, `PickDialog` for 3 slots  |
| 5    | `golf-domain-auditor` review for OAD semantics                                          |

**Command:** None

**Subagent:** `backlog-implementer` first; then `golf-domain-auditor` for OAD rules.

**Paste-ready prompt:**

```
Change plans to support 3 players per tournament: 1 locked + 2 options. Add slot column (1|2|3) to picks; unique (plan_id, event_id, slot). Migration + backfill slot=1 for existing. Update CreatePickSchema and API to accept slot. Update usePicks: getPicksForEvent returns { locked, option1, option2 }. Update PlanSeasonTable, PlanEventList, PlanPlayerTable, PickDialog to show and edit all 3 slots. Only the LOCKED pick consumes the player for OAD (used). Option 1 and Option 2 are "considered" — highlight with a consistent "considered" color; they do NOT consume the player.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, manual OAD constraint tests

---

## 4. Highlight future picks

### Current state

- `PlanPlayerTable` receives `usedPlayerIds` (from `getUsedPlayerIds()` — all picks with player_dg_id)
- Used players show "Used" badge and are disabled
- When viewing event T, we need to also show "Picked for [Future Event]" for players selected in T+1, T+2, etc.

### Implementation

1. **Data:** In `plan-detail-client.tsx`, when `selectedEventId` is set:

   - Get `futurePicks`: picks for events with `startDate > selectedEvent.startDate`
   - Build `futurePickMap: Map<number, { eventName: string }>` — player_dg_id → event name

2. **Props:** Pass `futurePickMap` to `PlanPlayerTable` and `PickDialog` → `PlanPlayerTable`

3. **UI:** In `PlanPlayerTable`, for each player row:
   - If `futurePickMap.has(player.dgId)`: show badge "Picked for [Event]" (e.g. blue/info style)
   - Do NOT disable — they're still selectable for current event (or are they? See domain note)

### Domain clarification

If a player is picked for a future event, can they still be picked for the current event? Typically no — that would violate OAD. So "future picks" are a subset of "used" in terms of selectability. The highlight is **informational**: "You've already planned to use X for The Masters — consider that when picking for this event." So we're not changing selectability; we're adding a visual cue that explains _why_ they're used (which future event).

Actually re-reading: "used" = already in a pick. So future picks ARE in usedPlayerIds. The ask is to **highlight** them differently — show "Picked for Masters" instead of just "Used" so planners have visibility. So we need to pass `usedPlayerIdToEventName` or similar — for used players that are in future events, show the event name.

### Execution Plan

| Step | Action                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | In `plan-detail-client`, compute `futurePickDetails: Map<number, string>` (player_dg_id → event name) for events after selected       |
| 2    | Pass to `PlanPlayerTable` as `futurePickEventNames: Record<number, string>` or `Map`                                                  |
| 3    | In `PlanPlayerTable`, when showing "Used" badge, if `futurePickEventNames[player.dgId]` exists, show "Picked for {eventName}" instead |

**Command:** None

**Subagent:** `backlog-implementer` (small change)

**Paste-ready prompt:**

```
When planning for tournament T, highlight players who are already selected for future tournaments (T+1, T+2, etc.) in the player list. For used players that are picked for future events, show "Picked for [Event Name]" instead of just "Used" so planners have visibility. Compute futurePickEventNames in plan-detail-client from picks + seasonEvents (events after selectedEventId), pass to PlanPlayerTable and PickDialog.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`

---

## 5. Purse (hardcoded, sortable)

### Current state

- `ProcessedTourEvent` / `TourEvent`: no purse field
- DataGolf schedule API: `RawTourEvent` has no purse
- Events displayed in `PlanSeasonTable`, `PlanEventList`, schedule pages

### Plan

1. **Data source:** Hardcoded map. Create `src/data/tournament-purses.ts`:

   ```ts
   export const TOURNAMENT_PURSES: Record<string, number> = {
     '123': 20_000_000, // Masters
     '456': 25_000_000 // Players
     // event_id -> purse in dollars
   }
   ```

2. **Types:** Add optional `purse?: number` to `ProcessedTourEvent` or resolve at display time via lookup.

3. **Display:** Add Purse column to `PlanSeasonTable`; add to `PlanEventList` card if space. Format as `$20M`, `$2.5M`.

4. **Sortable:** Add sort controls to event list/table — by date, by purse (asc/desc). Default remains date.

### Execution Plan

| Step | Action                                                                                               |
| ---- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1    | Create `src/data/tournament-purses.ts` with event_id → purse map (populate from PGA Tour purse data) |
| 2    | Add purse to `PlanSeasonTable` column; add to `PlanEventList` card                                   |
| 3    | Add sort state (date                                                                                 | purse) to plan detail; persist in URL or local state |

**Command:** None

**Subagent:** `backlog-implementer`

**Paste-ready prompt:**

```
Add tournament purse (prize money) to the app. Create src/data/tournament-purses.ts with hardcoded event_id -> purse map for PGA events. Add Purse column to PlanSeasonTable and show purse in PlanEventList cards. Make event list sortable by date (default) and by purse (asc/desc). Format as $20M, $2.5M.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`

---

## Summary: Recommended order

| Order | Item                             | Rationale                                                                   |
| ----- | -------------------------------- | --------------------------------------------------------------------------- |
| 1     | **Highlight future picks**       | Smallest change, no schema, immediate UX win                                |
| 2     | **Purse**                        | No schema, isolated, quick                                                  |
| 3     | **Three players per tournament** | Schema change; do before shared plans to avoid migrating shared plans twice |
| 4     | **Hottest golfers**              | New DataGolf integration; independent                                       |
| 5     | **Shared plans**                 | Largest; depends on stable plans schema                                     |

---

## Linear backlog items

Ordered by recommended implementation order (1 = first).

### 1. Highlight future picks _(do first)_

**Title:** Show "Picked for [Event]" for future picks in player list  
**Description:** When planning for event T, show which future events each used player is assigned to (e.g. "Picked for Masters") instead of generic "Used". Compute `futurePickEventNames` in plan-detail-client from picks + seasonEvents (events after selectedEventId), pass to PlanPlayerTable. No schema changes.  
**Labels:** `mvp`, `ux`  
**Estimate:** S

### 2. Purse (hardcoded) _(do second)_

**Title:** Add tournament purse, sortable  
**Description:** Create `src/data/tournament-purses.ts` with hardcoded event_id → purse map for PGA events. Add Purse column to PlanSeasonTable and show purse in PlanEventList cards. Make event list sortable by date (default) and by purse (asc/desc). Format as $20M, $2.5M. No schema changes.  
**Labels:** `mvp`, `data`  
**Estimate:** S

### 3. Three players per tournament _(schema change)_

**Title:** 1 locked pick + 2 options per tournament  
**Description:** Add slot column to picks (1=locked, 2=option1, 3=option2). Unique (plan_id, event_id, slot). Migration + backfill slot=1 for existing. **Only the locked pick consumes the player for OAD.** Option 1 and Option 2 are "considered" — highlight with a consistent "considered" color; they do NOT consume the player. Update CreatePickSchema, API routes, usePicks, PlanSeasonTable, PlanEventList, PlanPlayerTable, PickDialog. Run golf-domain-auditor after for OAD semantics.  
**Labels:** `mvp`, `schema`, `oad`  
**Estimate:** M

### 4. Hottest golfers _(DataGolf integration)_

**Title:** Add "hottest golfers" / recent form to plan player list  
**Description:** Compute average finish position over last 5 completed PGA events using `getHistoricalEventResults`. Add server-side query in `src/lib/api/datagolf/queries/` that aggregates by player; CUT/WD/DQ treated as position 70; require min 2 finishes. Expose via API route. Add sortable "Recent form" column or section to plan player table. Follow DataGolf skill: types → schemas → queries → mappers.  
**Labels:** `mvp`, `datagolf`, `planning`  
**Estimate:** M

### 5. Shared plans _(largest)_

**Title:** Shared plans between users  
**Description:** Create plan_members table (plan_id, user_id, role: owner|editor|viewer). Migration to create table and backfill owners from season_plans. Update RLS so season_plans and picks allow access when user is in plan_members. Add POST /api/plans/[id]/invite (email, role) and DELETE /api/plans/[id]/members/[userId]. Add Share button in plan header that opens modal to invite by email and list members. Editors can edit picks; viewers read-only. Run nextjs-app-router-auditor for RLS/security review.  
**Labels:** `mvp`, `schema`, `auth`  
**Estimate:** L

---

## Files reviewed

- `docs/CONTEXT.md`, `.cursor/rules/*`
- `src/lib/supabase/types.generated.ts`, `supabase/migrations/00000000000000_baseline.sql`
- `src/lib/api/datagolf/config.ts`, `types/`, `queries/historical-events.ts`, `mappers/historical-events.ts`
- `src/app/dashboard/(components)/plan-detail-client.tsx`, `plan-event-list.tsx`, `plan-player-table.tsx`, `plan-season-table.tsx`, `pick-dialog.tsx`
- `src/app/api/plans/route.ts`, `plans/[id]/picks/route.ts`
- `src/lib/supabase/hooks/use-picks.ts`, `route-auth.ts`
- `src/types/schedule.ts`
- DataGolf API docs (datagolf.com/api-access)

## Assumptions made

- Hottest = avg finish over last 5 events; CUT = 70; min 2 finishes.
- Shared plans: invite by email; owner/editor/viewer; no real-time sync.
- Three players: only locked slot consumes player for OAD; options are "considered" (highlight color, not used).
- Future picks: informational highlight only; used players already disabled.
- Purse: hardcoded map; no API source.

---

## Linear import (paste-ready)

Use these in Linear's create-issue flow or bulk import. Team/project/cycle depend on your workspace.

| #   | Title                                                     | Description (truncated)                                                                                        |
| --- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Show "Picked for [Event]" for future picks in player list | When planning for event T, show which future events each used player is assigned to instead of generic "Used". |
| 2   | Add tournament purse, sortable                            | Hardcoded purse map per event. Display in event table and cards. Sort by date or purse.                        |
| 3   | 1 locked pick + 2 options per tournament                  | Add slot column to picks. Only locked consumes OAD; options = "considered" (highlight color).                  |
| 4   | Add "hottest golfers" / recent form to plan player list   | Compute avg finish over last 5 events. Add sortable Recent form column.                                        |
| 5   | Shared plans between users                                | plan_members table, RLS, invite by email, Share UI.                                                            |
