"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GA4KpiProps {
  totals: {
    activeUsers: number;
    sessions: number;
    screenPageViews: number;
    engagementRate: number;
    averageSessionDuration: number;
    conversions: number;
  };
  days: number;
}

function formatNumber(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function GA4Kpi({ totals, days }: GA4KpiProps) {
  const avgDailyUsers = days > 0 ? Math.round(totals.activeUsers / days) : 0;
  const engagementPct = (totals.engagementRate * 100).toFixed(1);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(totals.activeUsers)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            avg {avgDailyUsers.toLocaleString()}/day
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(totals.sessions)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{days}D total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Page Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(totals.screenPageViews)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{days}D total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Engagement Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              Number(engagementPct) >= 50
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {engagementPct}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">avg per site</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(totals.averageSessionDuration)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">avg duration</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Conversions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatNumber(totals.conversions)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{days}D total</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function GA4KpiSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-xl p-4 space-y-3">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          <div className="h-3 w-16 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}
