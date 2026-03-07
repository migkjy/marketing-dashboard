"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CampaignTable({ campaigns }: { campaigns: CampaignData[] }) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>No campaigns sent yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            Campaign data will appear here after the first email campaign is sent via Brevo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Campaigns</CardTitle>
        <CardDescription>Recent campaign performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Campaign</th>
                <th className="text-right py-2 font-medium">Sent</th>
                <th className="text-right py-2 font-medium">Open %</th>
                <th className="text-right py-2 font-medium">Click %</th>
                <th className="text-right py-2 font-medium">Unsub</th>
                <th className="text-right py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0">
                  <td className="py-2 max-w-[200px] truncate">{c.name}</td>
                  <td className="text-right py-2">{c.sent.toLocaleString()}</td>
                  <td className="text-right py-2">{c.openRate}%</td>
                  <td className="text-right py-2">{c.clickRate}%</td>
                  <td className="text-right py-2">{c.unsubscribed}</td>
                  <td className="text-right py-2 text-muted-foreground">
                    {formatDate(c.sentDate)}
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
