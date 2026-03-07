# Cloudflare Analytics Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Cloudflare traffic analytics tab to marketing dashboard with per-site traffic, visitor trends, and country distribution.

**Architecture:** Cloudflare GraphQL Analytics API -> Next.js API route (5min cache) -> React client with recharts. Reuses existing DateRangeFilter and SiteSelector. New "Infrastructure" tab alongside existing Subscribers and CRM tabs.

**Tech Stack:** Cloudflare GraphQL API (fetch), recharts (existing), shadcn/ui Card (existing), Next.js App Router

---

### Task 1: Cloudflare API Client

**Files:**
- Create: `src/lib/cloudflare-api.ts`

**Step 1: Create cloudflare-api.ts with zone mapping and GraphQL client**

Zone ID dictionary (from Cloudflare API):
- ai-driven-architect.com: 1fcd3eed4c8f10602423f9290d7bbdd0
- aihubkorea.kr: be5d33ac36996663961f9793a972345e
- richbukae.com: 3b3b7f86297037edc3b87449b816da7e
- koreaaihub.kr: 5acb0a4a8d1a5290de5a5ad0e778f263
- deafnuri.com: f7725679cf2643093ef891b9709f7392
- newbizsoft.com: fde218d51e1c7fd63c24c72bca976feb

Exports:
- `ZONE_MAP` - site name -> zone ID
- `fetchZoneAnalytics(zoneId, startDate, endDate)` - GraphQL query for httpRequests1dGroups
- `fetchAllZonesAnalytics(days)` - parallel fetch all zones

**Step 2: Verify TypeScript compiles**

Run: `cd projects/marketing-dashboard && npx tsc --noEmit src/lib/cloudflare-api.ts`

---

### Task 2: API Route

**Files:**
- Create: `src/app/api/infrastructure/route.ts`

**Step 1: Create GET /api/infrastructure?days=N&site=all**

- Parse `days` and `site` from searchParams
- Call cloudflare-api functions
- Return JSON: { sites: [...], totals: { requests, visitors, bandwidth }, countryDistribution: [...] }
- 5min revalidate cache (match brevo pattern)

**Step 2: Test manually**

Run: `curl http://localhost:3000/api/infrastructure?days=7`

---

### Task 3: TrafficKpi Component

**Files:**
- Create: `src/components/dashboard/traffic-kpi.tsx`

**Step 1: Create KPI cards**

3 cards: Total Requests, Unique Visitors, Bandwidth (GB)
Pattern: match existing subscriber-kpi.tsx Card layout

---

### Task 4: TrafficTrendChart Component

**Files:**
- Create: `src/components/dashboard/traffic-trend-chart.tsx`

**Step 1: Create area chart**

recharts AreaChart for daily visitors/requests trend.
Pattern: match existing subscriber-trend-chart.tsx

---

### Task 5: CountryDistribution Component

**Files:**
- Create: `src/components/dashboard/country-distribution.tsx`

**Step 1: Create horizontal bar chart or table**

Top 10 countries by request count.
Use recharts BarChart horizontal or simple table (match existing style).

---

### Task 6: SiteTrafficTable Component

**Files:**
- Create: `src/components/dashboard/site-traffic-table.tsx`

**Step 1: Create comparison table**

Columns: Site, Requests, Visitors, Bandwidth
Sort by requests desc.

---

### Task 7: Integrate Infrastructure Tab in page.tsx

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/dashboard/site-selector.tsx` (add missing sites)

**Step 1: Add "Infrastructure" tab**

- Add Tab type: `"subscribers" | "crm" | "infrastructure"`
- Add tab button
- Add fetch for /api/infrastructure?days=N&site=S
- Render TrafficKpi + TrafficTrendChart + CountryDistribution + SiteTrafficTable

**Step 2: Update SiteSelector to include all Cloudflare zones**

Add: deafnuri, newbizsoft

---

### Task 8: Environment Variables + Build Verify

**Step 1: Add CLOUDFLARE env vars to .env.local**

Copy from root .env: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID

**Step 2: Build test**

Run: `cd projects/marketing-dashboard && npm run build`

---

### Task 9: Commit + Push

```bash
git add projects/marketing-dashboard/
git commit -m "feat: Cloudflare Analytics integration -- site traffic + country distribution"
git push origin main
```

---

## BLOCKER: API Token Permissions

Current CLOUDFLARE_API_TOKEN (R2 token) lacks `com.cloudflare.api.account.zone.analytics.read` permission.
CEO/VP action needed: Create new Cloudflare API token with "Zone Analytics: Read" permission, or edit existing token to add Analytics read.
Code will be implemented and ready -- will work once token has correct permissions.
