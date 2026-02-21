"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KpiData {
  totalContacts: number;
  totalDeals: number;
  totalDealAmount: number;
  totalPublishedPosts: number;
}

function formatKRW(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만`;
  }
  return amount.toLocaleString();
}

export function KpiCards({ data }: { data: KpiData }) {
  const cards = [
    {
      title: "Total Leads",
      value: data.totalContacts.toLocaleString(),
      description: "CRM contacts",
    },
    {
      title: "Total Deals",
      value: data.totalDeals.toLocaleString(),
      description: "All pipeline deals",
    },
    {
      title: "Deal Amount",
      value: `${formatKRW(data.totalDealAmount)}원`,
      description: "Total deal value",
    },
    {
      title: "Blog Posts",
      value: data.totalPublishedPosts.toLocaleString(),
      description: "Published articles",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
