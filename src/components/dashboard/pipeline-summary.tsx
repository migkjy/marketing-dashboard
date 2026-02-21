"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PipelineData {
  status: string;
  count: number;
  totalAmount: string | number | null;
}

const STATUS_LABELS: Record<string, string> = {
  inquiry: "Inquiry",
  quoted: "Quoted",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
};

const STATUS_COLORS: Record<string, string> = {
  inquiry: "bg-blue-500",
  quoted: "bg-yellow-500",
  negotiating: "bg-orange-500",
  won: "bg-green-500",
  lost: "bg-red-500",
};

function formatKRW(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function PipelineSummary({ data }: { data: PipelineData[] }) {
  const orderedStatuses = ["inquiry", "quoted", "negotiating", "won", "lost"];
  const sortedData = orderedStatuses
    .map((status) => data.find((d) => d.status === status))
    .filter(Boolean) as PipelineData[];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Pipeline</CardTitle>
        <CardDescription>Deals by status with amounts</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No deal data available
          </p>
        ) : (
          <div className="space-y-4">
            {sortedData.map((item) => {
              const amount = Number(item.totalAmount) || 0;
              return (
                <div key={item.status} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${STATUS_COLORS[item.status] || "bg-gray-500"}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} deals
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {formatKRW(amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
