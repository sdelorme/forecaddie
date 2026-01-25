Do a focused “production hardening” sweep for the selected area.

Checklist:

- error boundaries and loading states
- request timeout + retry/backoff for DataGolf
- rate limit detection and user-friendly messaging
- avoid root-layout live fetch if not needed everywhere
- `.env.example` exists and docs mention required vars
- add `/api/health` route if missing

Return:
P0 fixes + P1 fixes (with exact file paths)
