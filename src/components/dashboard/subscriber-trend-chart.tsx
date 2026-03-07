"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendData {
  trend: { date: string; newSubscribers: number; cumulative: number }[];
  totalNew: number;
  avgDaily: number;
  daysToTarget: number | null;
  days: number;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function SubscriberTrendChart({ data }: { data: TrendData }) {
  const chartData = data.trend.map((t) => ({
    date: formatDateShort(t.date),
    new: t.newSubscribers,
    cumulative: t.cumulative,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Trend</CardTitle>
        <CardDescription>
          {data.days}D | +{data.totalNew} new | avg {data.avgDaily}/day
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No trend data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                className="text-xs"
                interval="preserveStartEnd"
              />
              <YAxis allowDecimals={false} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--popover-foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="new"
                name="New Subscribers"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
