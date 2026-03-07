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
  Legend,
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

export function SubscriberTrendChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-36 bg-muted animate-pulse rounded mb-1" />
        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

export function SubscriberTrendChart({ data }: { data: TrendData }) {
  const chartData = data.trend.map((t) => ({
    date: formatDateShort(t.date),
    "신규 구독": t.newSubscribers,
    "누적 구독": t.cumulative,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriber Trend</CardTitle>
        <CardDescription>
          {data.days}D | +{data.totalNew} new | avg {data.avgDaily}/day
          {data.daysToTarget && (
            <span className="ml-2 text-orange-500">
              · {data.daysToTarget}d to target
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="text-muted-foreground text-sm">
              트렌드 데이터가 없습니다
            </div>
            <div className="text-muted-foreground text-xs">
              구독자 데이터가 쌓이면 차트가 표시됩니다
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="new"
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                orientation="left"
              />
              <YAxis
                yAxisId="cumulative"
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                orientation="right"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--popover-foreground)",
                  fontSize: 12,
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                yAxisId="new"
                type="monotone"
                dataKey="신규 구독"
                stroke="var(--chart-1)"
                fill="url(#colorNew)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Area
                yAxisId="cumulative"
                type="monotone"
                dataKey="누적 구독"
                stroke="var(--chart-2)"
                fill="url(#colorCumulative)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
