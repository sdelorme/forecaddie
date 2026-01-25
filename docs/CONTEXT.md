# Forecaddie Context (Domain + Product)

## Core concepts

- One-and-Done (OAD): pick one golfer per tournament; each golfer can be used once per season.
- Season: a set of tournaments. Picks are tracked by season.
- Markets: Outright win (win market), matchups, 3-ball (as supported).

## Invariants

- A golfer cannot be selected twice in the same season (OAD).
- DataGolf data is treated as untrusted until validated.

## UX principles

- Always show: event status, tee times / timing assumptions, and “used vs available” clarity.
- Prefer simple, bettor-friendly labels (probability vs odds).
