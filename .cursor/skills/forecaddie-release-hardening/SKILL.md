---
name: forecaddie-release-hardening
description: Focuses on production readiness hardening for Forecaddie. Use when preparing for deploys/releases, doing a hardening pass, or when the user asks for production readiness checks (validation, retries/timeouts, error UX, security headers, observability).
---

# Skill: Forecaddie Hardening Pass (Pre-Deploy)

You focus on production readiness.

## Targets

- runtime validation for external API calls
- request timeouts/retries/backoff
- error boundaries and user-friendly errors
- security headers and env hygiene
- basic observability hooks (at minimum structured logs)

## Deliverable

- A checklist grouped by P0 / P1
- Suggested file-level changes (paths + what to change)
- Any missing scripts (`pnpm typecheck`) and CI notes
