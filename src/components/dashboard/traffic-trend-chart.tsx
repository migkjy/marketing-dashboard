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

interface DailyTrend {
  date: string;
  requests: number;
  visitors: number;
  bytes: number;
}

interface TrafficTrendChartProps {
  data: DailyTrend[];
  days: number;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatNumber(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}

export function TrafficTrendChart({ data, days }: TrafficTrendChartProps) {
  const totalVisitors = data.reduce((s, d) => s + d.visitors, 0);
  const chartData = data.map((d) => ({
    date: formatDateShort(d.date),
    visitors: d.visitors,
    requests: d.requests,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Trend</CardTitle>
        <CardDescription>
          {days}D | {formatNumber(totalVisitors)} visitors total
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No traffic data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border"
              />
              <XAxis
                dataKey="date"
                className="text-xs"
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                className="text-xs"
                tickFormatter={formatNumber}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--popover-foreground)",
                }}
                formatter={(value) => [
                  Number(value).toLocaleString(),
                ]}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="requests"
                name="Requests"
                stroke="var(--chart-2)"
                fill="var(--chart-2)"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
