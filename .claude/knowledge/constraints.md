# Constraints

## Core Restriction
- **Internal tool only** — SEO/marketing/Lighthouse optimization is prohibited.
- This dashboard is for internal team use only. No public-facing optimization needed.

## DB Protection
- Read-only access via `app_user` — no schema modifications
- `drizzle-kit push` absolutely prohibited
- DROP TABLE / TRUNCATE prohibited
- Do not create new tables in the shared neondb without VP approval
- `neondb_owner` is migration-only — never use in application code

## Deployment
- No `vercel deploy` / `vercel --prod` CLI commands — Git push only
- No new Vercel project creation without CEO approval
- Vercel free plan: 100 deploys/day limit

## Development
- Do not modify existing code files unless explicitly tasked
- No sample/dummy data generation beyond 10 records without CEO request
- No .vercel.app links exposed externally
- No destructive commands (reset, rm -rf, DROP, --force-reset) without CEO approval

## Cross-Project
- No cross-service promotion or ecosystem links
- This project's data stays within this project
- Do not reference or link to other business-builder projects in UI
