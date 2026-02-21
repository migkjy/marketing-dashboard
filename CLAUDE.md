# Marketing Dashboard

## Overview
Integrated marketing dashboard MVP. Displays CRM metrics and blog content from neondb.

## Tech Stack
- Next.js 15+ (App Router), TypeScript
- shadcn/ui + Tailwind CSS v4
- recharts (charts)
- Drizzle ORM + @neondatabase/serverless

## DB
- Read-only access to neondb via app_user
- Tables: crm_contacts, crm_companies, crm_deals, blog_posts

## Structure
- `/api/metrics` - aggregation endpoint (KPI, source distribution, pipeline, posts)
- `/` - main dashboard page with KPI cards, charts, tables
