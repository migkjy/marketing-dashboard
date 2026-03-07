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

interface DailyData {
  date: string;
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
}

interface GA4TrendChartProps {
  data: DailyData[];
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

export function GA4TrendChart({ data, days }: GA4TrendChartProps) {
  const totalUsers = data.reduce((s, d) => s + d.activeUsers, 0);
  const chartData = data.map((d) => ({
    date: formatDateShort(d.date),
    "Active Users": d.activeUsers,
    Sessions: d.sessions,
    "Page Views": d.screenPageViews,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>GA4 Traffic Trend</CardTitle>
        <CardDescription>
          {days}D | {formatNumber(totalUsers)} active users total
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            GA4 데이터가 없습니다
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
                formatter={(value) => [Number(value).toLocaleString()]}
              />
              <Area
                type="monotone"
                dataKey="Active Users"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="Sessions"
                stroke="var(--chart-2)"
                fill="var(--chart-2)"
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="Page Views"
                stroke="var(--chart-3)"
                fill="var(--chart-3)"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
