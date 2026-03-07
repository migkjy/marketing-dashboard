"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

interface CampaignData {
  id: number;
  name: string;
  status: string;
  sentDate: string | null;
  sent: number;
  opened: number;
  openRate: number;
  clicked: number;
  clickRate: number;
  unsubscribed: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

function RateBadge({ value, thresholds }: { value: number; thresholds: [number, number] }) {
  const [good, mid] = thresholds;
  const color =
    value >= good
      ? "bg-green-100 text-green-700"
      : value >= mid
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium tabular-nums ${color}`}>
      {value}%
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent: "bg-blue-100 text-blue-700",
    draft: "bg-gray-100 text-gray-600",
    queued: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-orange-100 text-orange-700",
    archive: "bg-gray-100 text-gray-500",
  };
  const cls = map[status.toLowerCase()] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}

export function CampaignTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-36 bg-muted animate-pulse rounded mb-1" />
        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CampaignTable({ campaigns }: { campaigns: CampaignData[] }) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Campaigns
          </CardTitle>
          <CardDescription>No campaigns sent yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Mail className="h-8 w-8 opacity-30" />
            <p className="text-sm">첫 번째 캠페인을 발송하면 여기에 표시됩니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Campaigns
            </CardTitle>
            <CardDescription>
              Recent {campaigns.length} campaigns
            </CardDescription>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400" /> Open 20%+
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" /> 10–20%
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400" /> &lt;10%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-muted-foreground">Campaign</th>
                <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Sent</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Open %</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Click %</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Unsub</th>
                <th className="text-right py-2 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 max-w-[200px]">
                    <span className="truncate block" title={c.name}>{c.name}</span>
                  </td>
                  <td className="py-2.5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="text-right py-2.5 tabular-nums">{c.sent.toLocaleString()}</td>
                  <td className="text-right py-2.5">
                    <RateBadge value={c.openRate} thresholds={[20, 10]} />
                  </td>
                  <td className="text-right py-2.5">
                    <RateBadge value={c.clickRate} thresholds={[3, 1]} />
                  </td>
                  <td className="text-right py-2.5 tabular-nums text-muted-foreground">
                    {c.unsubscribed}
                  </td>
                  <td className="text-right py-2.5 text-muted-foreground">
                    {formatDate(c.sentDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden space-y-3">
          {campaigns.map((c) => (
            <div key={c.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium line-clamp-2">{c.name}</span>
                <StatusBadge status={c.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Sent</p>
                  <p className="text-sm font-medium tabular-nums">{c.sent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Open</p>
                  <RateBadge value={c.openRate} thresholds={[20, 10]} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Click</p>
                  <RateBadge value={c.clickRate} thresholds={[3, 1]} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-right">{formatDate(c.sentDate)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
