"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, List, Target } from "lucide-react";

interface SubscriberKpiData {
  totalContacts: number;
  newSubscribers: number;
  days: number;
  kr21Target: number;
  kr21Progress: number;
  lists: { id: number; name: string; subscribers: number }[];
}

export function SubscriberKpiSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="pb-2">
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-3 w-full bg-muted animate-pulse rounded-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function SubscriberKpi({ data }: { data: SubscriberKpiData }) {
  const avgDaily = data.days > 0
    ? Math.round((data.newSubscribers / data.days) * 10) / 10
    : 0;

  const remaining = data.kr21Target - data.totalContacts;
  const daysToTarget = avgDaily > 0 ? Math.ceil(remaining / avgDaily) : null;
  const progressPct = Math.min(data.kr21Progress, 100);

  const mainList = data.lists.find((l) => l.id === 7)?.subscribers || 0;

  const cards = [
    {
      title: "Total Subscribers",
      value: data.totalContacts.toLocaleString(),
      sub: "Brevo contacts",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      accent: "",
    },
    {
      title: `New (${data.days}D)`,
      value: `+${data.newSubscribers}`,
      sub: `avg ${avgDaily}/day`,
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
      accent: "text-green-600",
    },
    {
      title: "Main List",
      value: mainList.toLocaleString(),
      sub: "uniqstart",
      icon: <List className="h-4 w-4 text-muted-foreground" />,
      accent: "",
    },
    {
      title: "Target ETA",
      value: daysToTarget ? `${daysToTarget}d` : "N/A",
      sub: "to reach 15,000",
      icon: <Target className="h-4 w-4 text-orange-500" />,
      accent: daysToTarget && daysToTarget < 30 ? "text-orange-600" : "",
    },
  ];

  const progressColor =
    progressPct >= 80
      ? "bg-green-500"
      : progressPct >= 50
      ? "bg-blue-500"
      : "bg-orange-500";

  return (
    <div className="space-y-4">
      {/* KPI Cards Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.accent}`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* KR2-1 Progress Bar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              KR2-1 Progress
            </CardTitle>
            <span className="text-sm font-semibold tabular-nums">
              {data.totalContacts.toLocaleString()} / {data.kr21Target.toLocaleString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={`${progressColor} rounded-full h-3 transition-all duration-500`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {data.kr21Progress.toFixed(1)}% achieved
            </p>
            {remaining > 0 && (
              <p className="text-xs text-muted-foreground">
                {remaining.toLocaleString()} remaining
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lists Table */}
      {data.lists.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lists Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.lists.map((list) => {
                const pct = data.totalContacts > 0
                  ? Math.round((list.subscribers / data.totalContacts) * 100)
                  : 0;
                return (
                  <div key={list.id} className="flex items-center gap-3 py-1">
                    <span className="text-sm flex-1 truncate">{list.name}</span>
                    <div className="hidden sm:flex items-center gap-2 w-32">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary rounded-full h-1.5"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums">
                      {list.subscribers.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
