# Forecaddie Context (Domain + Product)

## Core concepts

- One-and-Done (OAD): pick one golfer per tournament; each golfer can be used once per season.
- Season: a set of tournaments. Picks are tracked by season.
- Markets: Outright win (win market), matchups, 3-ball (as supported).

## Invariants

- A golfer cannot be selected twice in the same season (OAD).
- DataGolf data is treated as untrusted until validated.

## UX principles

- Always show: event status, tee times / timing assumptions, and "used vs available" clarity.
- Prefer simple, bettor-friendly labels (probability vs odds).

## OAD Planning Workflow

- Users create season plans from the dashboard
- Each plan contains picks: one pick per tournament event
- Each player (identified by DataGolf `dg_id`) can only be assigned to one event per plan (One-and-Done constraint)
- OAD constraint enforced server-side in POST/PATCH `/api/plans/[id]/picks` routes (409 on violation)
- Client-side: used players shown with "Used" badge and are not selectable
- Plans are scoped to a season year; events are filtered to match
