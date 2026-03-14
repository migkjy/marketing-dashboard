# Marketing Dashboard - PL Session Rules

## Project Identity
- **Name**: marketing-dashboard
- **Type**: Internal tool (SEO/marketing/Lighthouse optimization prohibited)
- **GitHub**: migkjy/marketing-dashboard
- **Branch**: main (single branch, no staging/production)

## Tech Stack
- Next.js 16 (App Router), TypeScript, React 19
- Tailwind CSS v4 + shadcn/ui + Recharts
- Drizzle ORM + @neondatabase/serverless (read-only via app_user)
- Package manager: npm

## Architecture
- `/api/metrics` — single aggregation endpoint (KPI, source, pipeline, posts)
- `/` — dashboard page with KPI cards, charts, tables
- DB tables: crm_contacts, crm_companies, crm_deals, blog_posts

## DB Rules
- Read-only access via `app_user` (no DROP/TRUNCATE/CREATE)
- `drizzle-kit push` prohibited — use `drizzle-kit generate` only
- Shared neondb — do not create new tables without VP approval

## Session Protocol
- Reply to Jarvis: `scripts/project-reply.sh "message" "marketing-dashboard"`
- Commit format: `chore: update {file} — {summary}`
- Push: `git pull --rebase origin main && git push origin main`

## Knowledge Files
- `knowledge/architecture.md` — component and data flow details
- `knowledge/constraints.md` — project restrictions
- `knowledge/api-keys.md` — env vars reference (gitignored)
- `knowledge/history.md` — session history log
- `knowledge/learnings.md` — lessons learned

## Development Rules
- TDD mandatory: test first, then implement
- ralph-loop mandatory for all implementations
- Plan required before coding (writing-plans skill)
- VP approval required before execution
