"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SiteData {
  site: string;
  propertyId: string;
  totals: {
    activeUsers: number;
    sessions: number;
    screenPageViews: number;
    engagementRate: number;
    averageSessionDuration: number;
    conversions: number;
  };
  error?: string;
}

interface GA4SiteTableProps {
  sites: SiteData[];
}

function formatNumber(n: number): string {
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function GA4SiteTable({ sites }: GA4SiteTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Per-Site GA4 Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Site</th>
                <th className="text-right px-4 py-3 font-medium">Users</th>
                <th className="text-right px-4 py-3 font-medium">Sessions</th>
                <th className="text-right px-4 py-3 font-medium">Pageviews</th>
                <th className="text-right px-4 py-3 font-medium">Engagement</th>
                <th className="text-right px-4 py-3 font-medium">Avg Session</th>
                <th className="text-right px-4 py-3 font-medium">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr
                  key={site.site}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium capitalize">{site.site}</div>
                    {site.error && (
                      <div className="text-xs text-destructive mt-0.5">
                        {site.error.includes("PERMISSION_DENIED")
                          ? "권한 없음"
                          : site.error.slice(0, 40)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-blue-600 font-medium">
                    {formatNumber(site.totals.activeUsers)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatNumber(site.totals.sessions)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatNumber(site.totals.screenPageViews)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span
                      className={
                        site.totals.engagementRate >= 0.5
                          ? "text-green-600"
                          : "text-yellow-600"
                      }
                    >
                      {(site.totals.engagementRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatDuration(site.totals.averageSessionDuration)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-600 font-medium">
                    {formatNumber(site.totals.conversions)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
