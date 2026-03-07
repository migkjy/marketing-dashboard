"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriberKpiData {
  totalContacts: number;
  newSubscribers: number;
  days: number;
  kr21Target: number;
  kr21Progress: number;
  lists: { id: number; name: string; subscribers: number }[];
}

export function SubscriberKpi({ data }: { data: SubscriberKpiData }) {
  const avgDaily = data.days > 0
    ? Math.round((data.newSubscribers / data.days) * 10) / 10
    : 0;

  const remaining = data.kr21Target - data.totalContacts;
  const daysToTarget = avgDaily > 0 ? Math.ceil(remaining / avgDaily) : null;
  const progressPct = Math.min(data.kr21Progress, 100);

  return (
    <div className="space-y-4">
      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalContacts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Brevo contacts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New ({data.days}D)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{data.newSubscribers}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              avg {avgDaily}/day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Main List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.lists.find((l) => l.id === 7)?.subscribers || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">uniqstart</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Target ETA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysToTarget ? `${daysToTarget}d` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">to reach 15,000</p>
          </CardContent>
        </Card>
      </div>

      {/* KR2-1 Progress Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            KR2-1 Progress: {data.totalContacts.toLocaleString()} / {data.kr21Target.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary rounded-full h-3 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {data.kr21Progress}% achieved
            {remaining > 0 && ` | ${remaining.toLocaleString()} remaining`}
          </p>
        </CardContent>
      </Card>

      {/* Lists Table */}
      {data.lists.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.lists.map((list) => (
                <div key={list.id} className="flex items-center justify-between py-1 border-b last:border-b-0">
                  <span className="text-sm">{list.name}</span>
                  <span className="text-sm font-medium">{list.subscribers.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
