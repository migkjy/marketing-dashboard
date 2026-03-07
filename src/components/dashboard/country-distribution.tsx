"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CountryData {
  country: string;
  requests: number;
}

interface CountryDistributionProps {
  data: CountryData[];
}

export function CountryDistribution({ data }: CountryDistributionProps) {
  const total = data.reduce((s, d) => s + d.requests, 0);

  const chartData = data.map((d) => ({
    country: d.country || "Unknown",
    requests: d.requests,
    pct: total > 0 ? ((d.requests / total) * 100).toFixed(1) : "0",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Country Distribution (Top 10)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No country data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" className="text-xs" />
              <YAxis
                dataKey="country"
                type="category"
                className="text-xs"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--popover-foreground)",
                }}
                formatter={(value) => [
                  `${Number(value).toLocaleString()}`,
                  "Requests",
                ]}
              />
              <Bar
                dataKey="requests"
                fill="var(--chart-3)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
