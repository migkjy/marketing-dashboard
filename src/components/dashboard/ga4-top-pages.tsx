"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TopPage {
  pagePath: string;
  screenPageViews: number;
  activeUsers: number;
}

interface SourceData {
  sessionSource: string;
  sessions: number;
  activeUsers: number;
}

interface GA4TopPagesProps {
  topPages: TopPage[];
  sourceDistribution: SourceData[];
}

function formatNumber(n: number): string {
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
}

export function GA4TopPages({ topPages, sourceDistribution }: GA4TopPagesProps) {
  const maxViews = topPages[0]?.screenPageViews || 1;
  const maxSessions = sourceDistribution[0]?.sessions || 1;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {topPages.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              데이터 없음
            </p>
          ) : (
            <div className="space-y-3">
              {topPages.map((page) => (
                <div key={page.pagePath}>
                  <div className="flex justify-between text-sm mb-1">
                    <span
                      className="text-muted-foreground truncate max-w-[200px]"
                      title={page.pagePath}
                    >
                      {page.pagePath || "/"}
                    </span>
                    <span className="font-medium tabular-nums shrink-0 ml-2">
                      {formatNumber(page.screenPageViews)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(page.screenPageViews / maxViews) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Source Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          {sourceDistribution.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              데이터 없음
            </p>
          ) : (
            <div className="space-y-3">
              {sourceDistribution.map((src) => (
                <div key={src.sessionSource}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground capitalize">
                      {src.sessionSource || "(direct)"}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatNumber(src.sessions)} sessions
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${(src.sessions / maxSessions) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
