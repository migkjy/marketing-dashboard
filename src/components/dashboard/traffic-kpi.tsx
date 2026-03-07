"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrafficKpiProps {
  totals: { requests: number; visitors: number; bytes: number };
  days: number;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
  return `${bytes} B`;
}

function formatNumber(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

export function TrafficKpi({ totals, days }: TrafficKpiProps) {
  const avgDailyVisitors =
    days > 0 ? Math.round(totals.visitors / days) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(totals.requests)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {days}D total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unique Visitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(totals.visitors)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            avg {avgDailyVisitors.toLocaleString()}/day
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Bandwidth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatBytes(totals.bytes)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {days}D transferred
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Daily Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {days > 0
              ? formatNumber(Math.round(totals.requests / days))
              : "0"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">per day</p>
        </CardContent>
      </Card>
    </div>
  );
}
