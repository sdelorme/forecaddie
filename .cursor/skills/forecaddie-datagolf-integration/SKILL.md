---
name: forecaddie-datagolf-integration
description: Implements DataGolf API endpoints in Forecaddie using the standard pattern (types -> Zod schemas -> queries -> mappers -> tests) with consistent error handling (timeouts, retries/backoff, rate limit handling). Use when adding or changing DataGolf endpoints, schemas, queries, or mappers.
---

# Skill: DataGolf Integration Implementer

You implement DataGolf endpoints safely and consistently.

## Standard pattern for a new endpoint

1. Add raw types in `src/lib/api/datagolf/types/*`
2. Add Zod schemas in `src/lib/api/datagolf/schemas/*`
3. Add query in `src/lib/api/datagolf/queries/*`
4. Add mapper in `src/lib/api/datagolf/mappers/*`
5. Add integration test (or lightweight contract test) if possible

## Error handling standard

- Add timeout (AbortController)
- Retry with backoff for transient failures
- Detect rate limiting and surface a typed error
- Never throw raw fetch errors from UI layers

## Output

- Provide the exact files created/edited
- Include a short note on caching strategy (revalidate)
