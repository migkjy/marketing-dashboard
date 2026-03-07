"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SiteTraffic {
  site: string;
  requests: number;
  visitors: number;
  bandwidth: number;
}

interface SiteTrafficTableProps {
  data: SiteTraffic[];
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function SiteTrafficTable({ data }: SiteTrafficTableProps) {
  const sorted = [...data].sort((a, b) => b.requests - a.requests);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Traffic Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No site data available
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Site
                  </th>
                  <th className="text-right py-2 font-medium text-muted-foreground">
                    Requests
                  </th>
                  <th className="text-right py-2 font-medium text-muted-foreground">
                    Visitors
                  </th>
                  <th className="text-right py-2 font-medium text-muted-foreground">
                    Bandwidth
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s.site} className="border-b last:border-b-0">
                    <td className="py-2 font-medium">{s.site}</td>
                    <td className="py-2 text-right">
                      {s.requests.toLocaleString()}
                    </td>
                    <td className="py-2 text-right">
                      {s.visitors.toLocaleString()}
                    </td>
                    <td className="py-2 text-right">
                      {formatBytes(s.bandwidth)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
