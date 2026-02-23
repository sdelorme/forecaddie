# MVP Scope Execution Prompt

A comprehensive prompt for executing the [MVP Scope Execution Plan](./MVP-SCOPE-EXECUTION-PLAN.md) using the workflow planner, backlog implementer, and specialist agents.

---

## How to Use This Prompt

1. **Start with the workflow planner** to validate the plan and get a fresh execution sequence.
2. **Execute items in order** using the paste-ready prompts below.
3. **Invoke specialist agents** where indicated (golf-domain-auditor, nextjs-app-router-auditor).
4. **Run quality gates** after each item before moving on.

---

## Master Prompt: Execute MVP Scope Plan

Copy and paste this into Cursor to begin:

```
Execute the MVP Scope Execution Plan in docs/MVP-SCOPE-EXECUTION-PLAN.md.

Use the workflow-planner subagent first to:
1. Validate the plan against the current codebase
2. Confirm the recommended execution order (Highlight future picks → Purse → Three players → Hottest golfers → Shared plans)
3. Output any must-fix issues, warnings, or improvements

Then, for each backlog item in order, I will invoke the backlog-implementer with the paste-ready prompt from the plan. After items 3 (three players) and 5 (shared plans), invoke the specialist auditors as specified.

Reference: docs/MVP-SCOPE-EXECUTION-PLAN.md, docs/CONTEXT.md, .cursor/rules/*, .cursor/agents/*, .cursor/skills/*
```

---

## Model Preflight

Before invoking subagents, use these models for best results:

| Subagent                  | Recommended Model | Rationale                                     |
| ------------------------- | ----------------- | --------------------------------------------- |
| workflow-planner          | Default           | Planning only; model choice less critical     |
| backlog-implementer       | Claude 4.5 Opus   | Implementation depth, fewer missed edge cases |
| golf-domain-auditor       | Claude 4.5 Opus   | Domain nuance, OAD rule edge cases            |
| nextjs-app-router-auditor | GPT-5.2 Codex     | App Router + TS review precision              |

---

## Step-by-Step Execution

### Step 0: Validate Plan (Optional but Recommended)

**Invoke:** `mcp_task` with `subagent_type="workflow-planner"`

**Prompt:**

```
Review docs/MVP-SCOPE-EXECUTION-PLAN.md against the current Forecaddie codebase. Confirm:
1. The five backlog items are still accurate and implementable
2. The recommended order (Highlight future picks → Purse → Three players → Hottest golfers → Shared plans) is correct
3. No must-fix issues or contradictions
4. Output any warnings or improvements

Do NOT implement. Output a brief confirmation and any adjustments to the plan.
```

---

### Step 1: Highlight Future Picks

**Invoke:** `mcp_task` with `subagent_type="backlog-implementer"`

**Paste-ready prompt:**

```
Implement backlog item: Show "Picked for [Event]" for future picks in player list.

When planning for tournament T, highlight players who are already selected for future tournaments (T+1, T+2, etc.) in the player list. For used players that are picked for future events, show "Picked for [Event Name]" instead of just "Used" so planners have visibility.

Implementation:
1. In plan-detail-client.tsx, compute futurePickEventNames: Map<number, string> (player_dg_id → event name) for picks in events after selectedEventId
2. Pass futurePickEventNames to PlanPlayerTable and PickDialog
3. In PlanPlayerTable, when showing "Used" badge, if futurePickEventNames[player.dgId] exists, show "Picked for {eventName}" instead

Reference: docs/MVP-SCOPE-EXECUTION-PLAN.md §4. No schema changes.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`

---

### Step 2: Purse (Hardcoded, Sortable)

**Invoke:** `mcp_task` with `subagent_type="backlog-implementer"`

**Paste-ready prompt:**

```
Implement backlog item: Add tournament purse, sortable.

1. Create src/data/tournament-purses.ts with hardcoded event_id → purse map for PGA events (populate from PGA Tour purse data; use numeric event IDs from schedule)
2. Add Purse column to PlanSeasonTable; show purse in PlanEventList cards
3. Make event list sortable by date (default) and by purse (asc/desc)
4. Format as $20M, $2.5M for readability

Reference: docs/MVP-SCOPE-EXECUTION-PLAN.md §5. No schema changes.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`

---

### Step 3: Three Players Per Tournament (1 Locked + 2 Options)

**Invoke:** `mcp_task` with `subagent_type="backlog-implementer"`

**Paste-ready prompt:**

```
Implement backlog item: 1 locked pick + 2 options per tournament.

Schema:
- Add slot column (1|2|3) to picks; unique (plan_id, event_id, slot)
- Migration: ALTER TABLE picks ADD COLUMN slot integer DEFAULT 1; create unique index on (plan_id, event_id, slot); drop old (plan_id, event_id) unique
- OAD: Only LOCKED picks (slot 1) consume the player. API enforces uniqueness on (plan_id, player_dg_id) for slot=1 only. Option 1 and Option 2 do NOT consume the player.

Implementation:
1. Migration + backfill slot=1 for existing picks
2. Update CreatePickSchema, UpdatePickSchema; API routes (POST/PATCH) to accept slot; OAD check only for slot=1
3. Update usePicks: getPicksForEvent returns { locked, option1, option2 }
4. Update PlanSeasonTable, PlanEventList, PlanPlayerTable, PickDialog for 3 slots
5. Option slots: highlight with consistent "considered" color (distinct from "used")

Reference: docs/MVP-SCOPE-EXECUTION-PLAN.md §3.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`, `pnpm test:run`

**Then invoke:** `mcp_task` with `subagent_type="golf-domain-auditor"`

**Audit prompt:**

```
Review the three-players-per-tournament implementation for OAD semantics. Confirm:
1. Only locked picks (slot 1) consume the player for One-and-Done
2. Option 1 and Option 2 are correctly treated as "considered" (not used)
3. getUsedPlayerIds / usedPlayerIds only includes locked picks
4. UI clearly distinguishes "used" vs "considered"
5. No OAD rule violations

Files to review: picks API routes, use-picks.ts, PlanPlayerTable, PickDialog, plan-detail-client.
```

---

### Step 4: Hottest Golfers

**Invoke:** `mcp_task` with `subagent_type="backlog-implementer"`

**Paste-ready prompt:**

```
Implement backlog item: Add "hottest golfers" / recent form to plan player list.

Follow the forecaddie-datagolf-integration skill: types → schemas → queries → mappers.

Implementation:
1. Compute average finish position over last 5 completed PGA events using getHistoricalEventResults
2. Add src/lib/api/datagolf/queries/hottest-golfers.ts (or recent-form.ts) — server-side aggregation
3. Use parseFinishText from mappers/historical-events.ts; CUT/WD/DQ → position 70; require min 2 finishes
4. Add types in types/, schema in schemas/, mapper if needed
5. Expose via API route /api/hottest-golfers (or include in plan detail page data)
6. Add sortable "Recent form" column or section to PlanPlayerTable

Reference: docs/MVP-SCOPE-EXECUTION-PLAN.md §1. DataGolf skill: .cursor/skills/forecaddie-datagolf-integration/SKILL.md
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`, `pnpm test:run`

---

### Step 5: Shared Plans

**Invoke:** `mcp_task` with `subagent_type="backlog-implementer"`

**Paste-ready prompt:**

```
Implement backlog item: Shared plans between users.

Schema:
1. Create plan_members table: id, plan_id (FK), user_id (FK), role ('owner'|'editor'|'viewer'), created_at. Unique (plan_id, user_id)
2. Migration: create table; backfill (plan_id, user_id, 'owner') for each season_plans row

RLS:
3. season_plans: allow SELECT/UPDATE/DELETE if user in plan_members for that plan
4. picks: allow CRUD if user in plan_members; editor+ can mutate, viewer read-only

API:
5. Add POST /api/plans/[id]/invite (email, role) — lookup user by email, insert plan_members
6. Add DELETE /api/plans/[id]/members/[userId]
7. Plans list: use RLS (user sees plans where they're in plan_members)

UI:
8. Add Share button in plan header → modal: invite by email, list members with roles

Reference: docs/MVP-SCOPE-EXECUTION-PLAN.md §2.
```

**Quality gates:** `pnpm typecheck`, `pnpm lint`, manual RLS testing in Supabase

**Then invoke:** `mcp_task` with `subagent_type="nextjs-app-router-auditor"`

**Audit prompt:**

```
Review the shared plans implementation for RLS/security and App Router correctness. Confirm:
1. RLS policies correctly restrict access to plan_members
2. Invite API validates email, handles non-existent users, prevents duplicate members
3. Role checks (owner/editor/viewer) enforced on mutations
4. No secret leakage; safe headers; proper error handling
5. Server/client boundaries correct; no DataGolf from UI

Files to review: plan_members migration, RLS policies, /api/plans/[id]/invite, /api/plans/[id]/members, Share modal component.
```

---

## Post-Implementation: Hardening Pass (Optional)

After all five items are complete, run a hardening pass:

**Invoke:** Any agent with `forecaddie-release-hardening` skill

**Prompt:**

```
Run a production readiness hardening pass on the MVP scope changes. Focus on:
- Runtime validation for new API routes (hottest-golfers, invite)
- Error boundaries and user-friendly errors for Share/invite flows
- Security: RLS, invite validation, no secret leakage
- Structured logs for invite/member operations

Reference: .cursor/skills/forecaddie-release-hardening/SKILL.md
```

---

## Skills Reference

| Skill                           | When to Use                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| forecaddie-datagolf-integration | Item 4 (Hottest golfers) — types, schemas, queries, mappers |
| forecaddie-golf-domain          | Item 3 (Three players) — OAD semantics review               |
| forecaddie-nextjs-typescript    | Item 5 (Shared plans) — RLS, security, App Router review    |
| forecaddie-release-hardening    | Post-MVP — production readiness                             |

---

## Subagent Invocation (mcp_task)

When using `mcp_task`, specify:

- `subagent_type`: `workflow-planner` | `backlog-implementer` | `golf-domain-auditor` | `nextjs-app-router-auditor`
- `prompt`: The paste-ready prompt from above
- `description`: Short 3–5 word summary (e.g. "Implement highlight future picks")

Example:

```
mcp_task(description="Implement highlight future picks", prompt="[Step 1 paste-ready prompt]", subagent_type="backlog-implementer")
```

---

## Checklist

- [ ] Step 0: Workflow planner validation (optional)
- [ ] Step 1: Highlight future picks → typecheck, lint
- [ ] Step 2: Purse → typecheck, lint
- [ ] Step 3: Three players → typecheck, lint, test → golf-domain-auditor
- [ ] Step 4: Hottest golfers → typecheck, lint, test
- [ ] Step 5: Shared plans → typecheck, lint, manual RLS test → nextjs-app-router-auditor
- [ ] Post-MVP: Hardening pass (optional)
