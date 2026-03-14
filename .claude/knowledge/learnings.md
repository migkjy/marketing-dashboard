# Learnings

## Project-Specific
- Dashboard uses a single `/api/metrics` endpoint for all data — no separate API routes per entity
- DB connection uses `@neondatabase/serverless` (HTTP driver via neon()) not traditional pg pool
- All dashboard components are in `src/components/dashboard/` — keep this pattern
- shadcn/ui components go in `src/components/ui/`

## Gotchas
- The API route uses `force-dynamic` — no caching at the route level
- Blog posts table uses UUID primary key while CRM tables use text IDs
- `app_user` has no write permissions — any INSERT/UPDATE/DELETE will fail
