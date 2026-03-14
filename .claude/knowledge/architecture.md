# Architecture

## Overview
Internal marketing dashboard that visualizes CRM metrics and blog content from the shared neondb.

## Data Flow
```
neondb (app_user, read-only)
  -> Drizzle ORM (@neondatabase/serverless)
  -> /api/metrics (Next.js Route Handler, force-dynamic)
  -> Dashboard UI (client components with recharts)
```

## Directory Structure
```
src/
  app/
    layout.tsx          — Root layout (ko locale, Geist font)
    page.tsx            — Main dashboard page
    globals.css         — Tailwind v4 styles
    api/metrics/route.ts — Aggregation API endpoint
  components/
    dashboard/
      kpi-cards.tsx     — KPI summary cards
      source-chart.tsx  — Lead source distribution chart
      pipeline-summary.tsx — Deal pipeline overview
      recent-posts.tsx  — Recent blog posts table
    ui/
      card.tsx          — shadcn card component
  db/
    index.ts            — Drizzle + Neon connection
    schema.ts           — Table definitions (Drizzle ORM)
  lib/
    utils.ts            — Utility functions (cn)
```

## DB Schema
- **crm_contacts**: id, name, email, phone, companyId, source (enum), status (enum), notes, timestamps
- **crm_companies**: id, name, industry, website, size, notes, timestamps
- **crm_deals**: id, title, amount, status (enum), contactId, expectedCloseDate, notes, timestamps
- **blog_posts**: id (uuid), title, slug, content, excerpt, category, tags[], author, published, publishedAt, metaDescription, timestamps, featuredImage

## Enums
- `crm_contact_source`: website, blog, kmong, referral, direct, other
- `crm_contact_status`: lead, prospect, customer, churned
- `crm_deal_status`: inquiry, quoted, negotiating, won, lost

## API Response Shape (/api/metrics)
```json
{
  "kpi": { "totalContacts", "totalDeals", "totalDealAmount", "totalPublishedPosts" },
  "sourceDistribution": [{ "source", "count" }],
  "dealPipeline": [{ "status", "count", "totalAmount" }],
  "recentPosts": [{ "id", "title", "slug", "category", "author", "published", "publishedAt", "createdAt" }]
}
```
